import PlutoAxios from "./pluto";

export type ProfileParams = {
  affiliation_id: string;
  affiliation_name: string;
  bio: string;
  email: string;
  is_email_public: boolean;
  first_name: string;
  last_name: string;
  web_page: string;
}

class ProfileAPI extends PlutoAxios {
  public async createProfile(params: ProfileParams) {
    const res = await this.post('/profiles/me', {
      ...params,
    });
    if (res) {
      return res.data.data.content;
    }
  }
}

const profileAPI = new ProfileAPI();

export default profileAPI;
