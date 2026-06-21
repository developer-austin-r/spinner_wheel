import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Role } from './role.entity';
import { Spinner } from './spinner.entity';
import { SpinnerAmount } from './spinner-amount.entity';
import { SelectedSpinnerValue } from './selected-spinner-value.entity';

@Entity({ name: 'users' })
@Index(['roleId'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Index()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ name: 'phone_number', nullable: true })
  phoneNumber?: string;

  @Column({ name: 'role_id' })
  roleId: number;

  @ManyToOne(() => Role, (role) => role.users, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => SpinnerAmount, (value) => value.user)
  spinnerAmounts: SpinnerAmount[];

  @OneToMany(() => Spinner, (spinner) => spinner.user)
  spinners: Spinner[];

  @OneToMany(() => SelectedSpinnerValue, (value) => value.user)
  selectedSpinnerValues: SelectedSpinnerValue[];
}
