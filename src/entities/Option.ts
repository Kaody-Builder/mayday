import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Questionnaire } from './Questionnaire';

@Entity("Option")
export class Option {
    @PrimaryGeneratedColumn({
        type: "integer",
        name: "id_op"
    })
    idOp: number;

    @Column("bit", { name: "type_op" })
    typeOp: number;

    @Column("character varying", { name: "valeur_op", length: 10 })
    valeurOp: string;

    @ManyToOne(() => Questionnaire, (questionnaire) => questionnaire.idQuest)
    questionnaire: Questionnaire;
}
