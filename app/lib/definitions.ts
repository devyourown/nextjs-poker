export type User = {
  id: string;
  name: string;
  email: string;
  imageSrc?: string;
  money?: number;
  password?: string;
};

export type Money = {
  id: string;
  user_id: string;
  amount: number;
};

export type Chat = {
  author: string;
  content: string;
};
