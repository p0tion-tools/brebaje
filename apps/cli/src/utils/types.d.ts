export interface ContributeOptions {
  ceremony?: string;
  entropy?: string;
  auth?: string;
}

export interface CreateOptions {
  template?: string;
  auth?: string;
}

export interface FinalizeOptions {
  auth?: string;
}

export interface CeremonyUrls {
  download_info: {
    field_name: string;
    s3_key_field: string;
    expiration: string;
    download_url: string;
  };
  upload_info: {
    field_name: string;
    s3_key_field: string;
    expiration: string;
    upload_url: string;
  };
}

export interface ListParticipantsOptions {
  ceremony?: string;
}

export interface CeremonyUrls {
  download_info: {
    field_name: string;
    s3_key_field: string;
    expiration: string;
    download_url: string;
  };
  upload_info: {
    field_name: string;
    s3_key_field: string;
    expiration: string;
    upload_url: string;
  };
  vm_info: {
    instance_id: string | null;
    bucket_name: string;
  };
}
