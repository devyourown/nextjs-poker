export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Money = {
  id: string;
  user_id: string;
  amount: number;
};
