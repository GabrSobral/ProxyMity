import { randomUUID } from 'node:crypto';

import { Replace } from '@helpers/Replace';

interface UserProps {
  name: string;
  email: string;
  password: string;
  lastOnline: Date | null;
  createdAt: Date;
  photoUrl: string | null;
}

export class User {
  private _id: string;
  private props: UserProps;

  private constructor(props: UserProps, id?: string) {
    this._id = id ?? randomUUID();
    this.props = props;
  }

  public get id() {
    return this._id;
  }

  public set name(name: string) {
    this.props.name = name;
  }
  public get name() {
    return this.props.name;
  }

  public set email(email: string) {
    this.props.email = email;
  }
  public get email() {
    return this.props.email;
  }

  public set password(password: string) {
    this.props.password = password;
  }
  public get password() {
    return this.props.password;
  }

  public set lastOnline(lastOnline: Date | null) {
    this.props.lastOnline = lastOnline;
  }
  public get lastOnline() {
    return this.props.lastOnline;
  }

  public set photoUrl(photoUrl: string | null) {
    this.props.photoUrl = photoUrl;
  }
  public get photoUrl() {
    return this.props.photoUrl;
  }

  public get createdAt() {
    return this.props.createdAt;
  }

  static create(props: Replace<UserProps, { createdAt?: Date; photoUrl?: string; lastOnline?: Date }>, id?: string) {
    const instance = new User(
      {
        ...props,
        createdAt: props?.createdAt || new Date(),
        photoUrl: props?.photoUrl || null,
        lastOnline: props?.lastOnline || null,
      },
      id ?? randomUUID(),
    );

    return instance;
  }
}
