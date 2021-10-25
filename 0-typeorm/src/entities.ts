import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "company" })
export class Company {
  @PrimaryGeneratedColumn({ name: "id", type: "int" })
  id: number;

  @Column({ name: "name" })
  name: string;
}
