import { IHttp, IHttpRequest, IRead } from '@rocket.chat/apps-engine/definition/accessors';

export interface IVerificationinfo {
    record_name: string;
    record_target: string;
}

export interface IVerirication {
    certificate_status: string;
    signature: string;
    brand_check: boolean;
    verification_info: IVerificationinfo;
    verification_status?: any;
    verification_type: string;
}

export interface ICloudflareResponse<T> {
    result: Array<T>;
    success: boolean;
    errors: Array<any>;
    messages: Array<any>;
}

class SDK {
    public async getSslVerification(http: IHttp, read: IRead) {
        const url = 'https://api.cloudflare.com/client/v4/zones/447cd9422744a695c8386a1d97d2bc10/ssl/verification?retry=true';

        const options: IHttpRequest = {
            headers: await this.getHeaders(read),
        };

        const response = await http.get(url, options);

        return response.data as ICloudflareResponse<IVerirication>;
    }

    public async hasAuthInfo(read: IRead): Promise<boolean> {
        const headers = await this.getHeaders(read);

        return !!headers['X-Auth-Key'] && !!headers['X-Auth-Email'];
    }

    private async getHeaders(read: IRead): Promise<{[key: string]: string}> {
        const settingsReader = read.getEnvironmentReader().getSettings();
        const authKeySetting = await settingsReader.getValueById('auth_key');
        const authEmailSetting = await settingsReader.getValueById('auth_email');

        return {
            'X-Auth-Key': authKeySetting,
            'X-Auth-Email': authEmailSetting,
        };
    }
}

export const sdk = new SDK();
