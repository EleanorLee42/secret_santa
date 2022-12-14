export interface MiniPerson {
  Name: string;
  id: string;
  nickname: string;
}
export interface Group {
  Name: string;
  joinCode: string;
  numPeople: number;
  id: string;
  People: MiniPerson[];
  date: string;
  description: string;
  isPublic: boolean;
  adminID: string;
}
export interface MiniGroup {
  GifteeName: string;
  GifteeID: string;
  GroupID: string;
}
export interface Person {
  Groups: MiniGroup[];
  Interests: string;
  Name: string;
  PhoneNumber: string;
  Token: string;
  email: string;
  id: string;
}