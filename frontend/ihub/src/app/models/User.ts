export class User {
    "id"?: string;
    "firstname"?: string;
    "lastname"?: string;
    "password"?: string;
    "email"?: string;
    "role"?: UserRole;
    "country"?: string;
    "city"?: string;
    "balance"?: number;
}

export class UserRole{
    "name"?: string;
    "id"?: number;
}