import type {MembershipPlan} from "@/feature/membership/MembershipPlan.ts";

export type UserModel = {
  id: string;
  email: string;
  fullName: string;
  membershipExpires?: Date;
  roles: string[];
  plan?: MembershipPlan
}


export const hasMembership = (user: UserModel | null): boolean => {
  if (user === null || !user.membershipExpires) {
    return false;
  }
  return user.membershipExpires.getTime() > new Date().getTime();
}

export const hasAdmin = (user: UserModel | null): boolean => {
  if (user === null) {
    return false;
  }
  return user.roles.indexOf("Admin") >= 0 || user.roles.indexOf("SuperAdmin") >= 0;
}