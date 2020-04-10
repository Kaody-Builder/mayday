import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Intervention } from "./Intervention";
import { Reply } from "./Reply";
import { User } from "./User";

@Index("Distress_pkey", ["idDist"], { unique: true })
@Entity("Distress")
export class Distress {
    @PrimaryGeneratedColumn({
        type: "integer",
        name: "id_dist"
    })
    idDist: number;

    @Column({
        type: 'geometry',
        nullable: true,
        spatialFeatureType: 'Point',
        srid: 4326, name: "coord_dist"
    })
    coordDist: string;

    @Column("timestamptz", { nullable: true, name: "date_dist" })
    dateDist: string;

    @Column("character varying", { nullable: true, name: "photo_dist" })
    photoDist: string;

    @Column("bit", { nullable: true,  name: "niv_prio_dist" })
    levelDist: number;

    @OneToMany(() => Intervention, (intervention) => intervention.idInte)
    interventions: Intervention[];

    @OneToMany(() => Reply, (reply) => reply.idRepl)
    replys: Reply[];

    @ManyToOne(() => User, (user) => user.idUser)
    idUser: User;
}
