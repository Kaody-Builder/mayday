import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Equipe } from "./Equipe";

@Index("Central_pkey", ["idCent"], { unique: true })
@Entity("Central")
export class Central {
    @PrimaryGeneratedColumn({
        type: "integer",
        name: "id_cent"
    })
    idCent: number;

    @Column("character varying", { name: "reg_cent", length: 255 })
    regCent: string;

    @OneToMany(() => Equipe, (equipe) => equipe.idCent)
    equipes: Equipe[];
}
