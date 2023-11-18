import { ApiProperty } from '@nestjs/swagger';

export abstract class CommonResponse {
  readonly message: string;
}

export abstract class ScrollPaginatedResponse {
  readonly anchor: number;
  readonly limit: number;
}

export class FileUploadBody {
  @ApiProperty({ type: 'string', format: 'binary', description: 'Image file' })
  file: unknown;
}

export abstract class EmptyResponse extends CommonResponse {}
