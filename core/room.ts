import { User } from "@/app/lib/definitions";

export function isEveryoneReady(users: User[]): boolean {
    if (users.length < 2) return false;
    let result = true;
    users.forEach(({ ready }) => {
        if (!ready) result = false;
    });
    return result;
}

export function makeUserReady(users: User[], target: string) {
    return users.map((user) => {
        if (user.name === target) {
            user.ready = !user.ready;
        }
        return user;
    });
}
