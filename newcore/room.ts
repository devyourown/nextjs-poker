import { User } from "@/app/lib/definitions";

export function isEveryoneReady(users: User[]): boolean {
    let result = true;
    users.forEach(({ ready }) => {
        if (!ready) result = false;
    });
    return result;
}
