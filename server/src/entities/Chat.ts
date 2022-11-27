import {
  Entity,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  BaseEntity,
} from 'typeorm';

@Entity()
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn()
  telegramId: number;

  @Column()
  type: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date;
}
