import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Intervention } from "./Intervention";
import { Reponse } from "./Reponse";

@Index("Signalement_pkey", ["idSign"], { unique: true })
@Entity("Signalement")
export class Signalement {
    @PrimaryGeneratedColumn({
        type: "integer",
        name: "id_sign"
    })
    idSign: number;

    @Column({
        type: 'geometry',
        nullable: true,
        spatialFeatureType: 'Point',
        srid: 4326, name: "coord_sign"
    })
    coordSign: string;

    @Column("timestamptz", { nullable: true, name: "date_sign" })
    dateSign: string;

    @Column("character varying", { nullable: true, name: "photo_sign" })
    photoSign: string;

    @Column("bit", { nullable: true,  name: "niv_prio_sign" })
    nivPrioSign: number;

    @OneToMany(() => Intervention, (intervention) => intervention.idSign)
    interventions: Intervention[];

    @OneToMany(() => Reponse, (reponse) => reponse.idSign)
    reponses: Reponse[];
}
