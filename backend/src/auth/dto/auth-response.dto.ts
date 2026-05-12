export class AuthResponseDto {
  success: boolean;
  message: string;
  access_token: string;
  user: {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
    role: {
      id: number;
      roleName: string;
      slug: string;
    };
  };
}
