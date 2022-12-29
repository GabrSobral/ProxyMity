import { randomUUID } from 'node:crypto';

import { Replace } from '@helpers/Replace';

interface ContactProps {
  name: string;
  email: string;
  password: string;
  lastOnline: Date | null;
  createdAt: Date;
}

export class Contact {
  private _id: string;
  private props: ContactProps;

  private constructor(props: ContactProps, id?: string) {
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

  public get createdAt() {
    return this.props.createdAt;
  }

  static create(
    props: Replace<ContactProps, { createdAt?: Date }>,
    id?: string,
  ) {
    const instance = new Contact(
      {
        ...props,
        createdAt: props?.createdAt ?? new Date(),
      },
      id ?? randomUUID(),
    );

    return instance;
  }
}
