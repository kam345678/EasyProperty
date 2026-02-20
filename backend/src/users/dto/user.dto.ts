export class CreateUserByAdminDto {
  username: string; // email
  role: 'admin' | 'tenant' | 'staff';

  profile: {
    fullName: string;
    phone: string;
    idCardNumber: string;
    avatarUrl?: string;
    birthDate: Date;
  };
}
