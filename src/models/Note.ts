interface ConstructorParams {
  bgImage?: string;
  icon?: string;
  title: string;
  content: string;
  footNote: string;
  userId: string;
  children: string[];
}

export class Note {
  bgImage: string = "";
  icon: string = "";
  title: string = "";
  content: string = "";
  footNote: string = "";
  createdAt: string = ""; // date time in ISO string
  updatedAt: string = ""; // date time in ISO string
  userId: string = "";
  children: string[] = [];

  constructor({
    bgImage,
    icon,
    title,
    content,
    footNote,
    userId,
    children,
  }: ConstructorParams) {
    this.bgImage = bgImage || "";
    this.icon = icon || "";
    this.title = title;
    this.content = content;
    this.footNote = footNote;
    this.userId = userId;
    this.children = children;
  }
}
