import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';
import { Recipe } from './Recipe';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'bigint', unique: true })
  telegramId: number;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  isBot: boolean;

  @OneToMany(() => Recipe, (recipe) => recipe.user)
  recipes: Recipe[];

  @Column({ nullable: true })
  languageCode: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt!: Date;
}
