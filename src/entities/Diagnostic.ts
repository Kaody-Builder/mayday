import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Intervention } from "./Intervention";
import { Reply } from "./Reply";
import { User } from "./User";

@Index("Diagnostic_pkey", ["idDiag"], { unique: true })
@Entity("Diagnostic")
export class Diagnostic {
    @PrimaryGeneratedColumn({
        type: "integer",
        name: "id_diag"
    })
    idDiag: number;

    @Column("timestamptz", { nullable: true, name: "date_diag" })
    dateDiag: string;

    @Column("float", { nullable: true,  name: "result_diag" })
    resultDiag: number;

    @OneToMany(() => Intervention, (intervention) => intervention.idInte)
    interventions: Intervention[];

    @OneToMany(() => Reply, (reply) => reply.idRepl)
    reply: Reply[];
    
    @ManyToOne(() => User, (user) => user.idUser)
    idUser: User;
}
