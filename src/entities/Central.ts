import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import { Team } from "./Team";

@Index("Central_pkey", ["idCent"], { unique: true })
@Entity("Central")
export class Central {
    @PrimaryGeneratedColumn({
        type: "integer",
        name: "id_cent"
    })
    idCent: number;

    @Column({
        type: 'geography',
        nullable: false,
        spatialFeatureType: 'Point',
        srid: 4326,
        name: "coord_cent"
    })
    coordCent: string;

    @Column('character varying',{
        nullable: false,
        length: "20",
        name: "login_cent"
    })
    loginCent: string;

    @Column({
        type: 'text',
        nullable: false,
        name: "pass_cent"
    })
    passCent: string;

    @OneToMany(() => Team, (team) => team.idCent)
    teams: Team[];

}
