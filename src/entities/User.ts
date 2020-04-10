import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Distress } from './Distress';
import { Diagnostic } from './Diagnostic';

@Index("User_pkey", ["idUser"], { unique: true })
@Entity("User")
export class User {
    @PrimaryGeneratedColumn({
        type: "integer",
        name: "id_user"
    })
    idUser: number;

    @Column("character varying", { nullable: false, length: 200, name: "fullname_user" })
    fullnameUser: string;

    @Column("character varying", { nullable: false, length: 200, name: "phone_user" })
    phoneUser: string;

    @Column("character varying", { nullable: false, length: 250, name: "pass_user" })
    passUser: string;

    @Column("boolean", { nullable: false, name: "gender_user" })
    genderUser: boolean;

    @OneToMany(() => Distress, (distress) => distress.idDist)
    distresss: Distress[];

    @OneToMany(() => Diagnostic, (diagnostic) => diagnostic.idDiag)
    diagnostics: Diagnostic[];
}
