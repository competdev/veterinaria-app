import { Inject, Injectable } from "@nestjs/common";
import { MaxTimeoutReached, NotFoundLabel, EntityEnum, CellCounterService } from "../../../utils";
import {
	DI_CELLCOUNTERSERVICE,
	DI_DOCUMENTSERVICE,
	DI_ENVIRONMENT,
	DI_HEMOGRAMEXAMSERVICE,
	DI_JOBSERVICE,
	Enviroment,
} from "../../../configs";
import { JobService } from "./job.service";
import { HemogramExamService } from "./hemogram-exam.service";
import { DocumentService } from "./document.service";
import { JobDTO, UpdateHemogramExamDTO, UpdateJobDTO } from "../../adapter/dto";
import { StatusEnum } from "../../../enums";
import { Cron, CronExpression } from "@nestjs/schedule";

@Injectable()
export class JobRunnerService {
	constructor(
		@Inject(DI_JOBSERVICE) private readonly jobService: JobService,
		@Inject(DI_HEMOGRAMEXAMSERVICE) private readonly hemogramExamService: HemogramExamService,
		@Inject(DI_DOCUMENTSERVICE) private readonly documentService: DocumentService,
		@Inject(DI_CELLCOUNTERSERVICE) private readonly cellCounterService: CellCounterService,

		@Inject(DI_ENVIRONMENT) private readonly configService: Enviroment,
	) {}

	@Cron(CronExpression.EVERY_MINUTE)
	async runLambdaFunctionJob(): Promise<void> {
		try {
			await this.handleLambdaFunctionJob();
		} catch (err) {
			console.log(err);
		}
	}

	@Cron(CronExpression.EVERY_5_MINUTES)
	async removeFailedJobs(): Promise<void> {
		try {
			await this.handleRemoveJob();
		} catch (err) {
			console.log(err);
		}
	}

	private async handleLambdaFunctionJob(): Promise<void> {
		try {
			const jobs = await this.jobService.getAllJobsForRunner();
			for (const job of jobs) {
				await this.execLambdaFunctionJob(job);
			}
		} catch (err) {
			throw err;
		}
	}

	private async handleRemoveJob(): Promise<void> {
		try {
			const runningJobs = await this.jobService.getAllRunningJobs();

			for (const runningJob of runningJobs) {
				const timeDifference = new Date().getTime() - runningJob.updateDate.getTime();
				const timeDifferenceInMinutes = timeDifference / 60000;
				const timeOutTime = Number(this.configService.JOB_TIMEOUT);

				if (timeDifferenceInMinutes >= timeOutTime) {
					await this.handleJobError(runningJob, MaxTimeoutReached());
				}
			}
		} catch (err) {
			throw err;
		}
	}

	private async execLambdaFunctionJob(job: JobDTO): Promise<void> {
		try {
			await this.updateJobStatus(job, StatusEnum.RUNNING);
			const originalPhotosFromDocument = job.hemogramExam.hemogramExamDocuments.find((document) => !document.isResult);

			if (!originalPhotosFromDocument) {
				throw new Error(NotFoundLabel(EntityEnum.DOCUMENT));
			}

			const originalFile = await this.documentService.downloadFile(originalPhotosFromDocument.document.id, {}, true);
			const result = await this.cellCounterService.getCellCount({ base64File: originalFile.base64File });
			const fileBuffer = Buffer.from(result.base64File, "base64");
			const targetUser = await job.hemogramExam.user;

			const uploadedImage = await this.documentService.uploadResponseFile(fileBuffer, { user: targetUser });

			await this.hemogramExamService.updateHemogramExamWithResults(job.hemogramExam, {
				cellCount: result.cellCount,
				hemogramExamDocuments: [uploadedImage],
			});

			await this.updateJobStatus(job, StatusEnum.FINISHED);
		} catch (err: any) {
			await this.handleJobError(job, err.message);
		}
	}

	private async handleJobError(job: JobDTO, errMessage: string): Promise<void> {
		try {
			job.errorCount++;
			if (job.errorCount >= job.retryCount) {
				job.statusReason = errMessage;
				await this.updateJobStatus(job, StatusEnum.FAILED);
				return;
			}

			await this.updateJobStatus(job, StatusEnum.AWAITING);
		} catch (err) {
			throw err;
		}
	}

	private async updateJobStatus(job: JobDTO, newStatusId: number): Promise<void> {
		try {
			job.status.id = newStatusId;
			job.hemogramExam.status.id = newStatusId;

			const JobToUpdate: UpdateJobDTO = {
				errorCount: job.errorCount,
				statusReason: job.statusReason,
				status: job.status,
			};

			const hemogramExamToUpdate: UpdateHemogramExamDTO = {
				status: job.hemogramExam.status,
			};

			await this.jobService.updateById(job.id, JobToUpdate);
			await this.hemogramExamService.updateById(job.hemogramExam.id, hemogramExamToUpdate, {}, true);
		} catch (err) {
			throw err;
		}
	}
}
