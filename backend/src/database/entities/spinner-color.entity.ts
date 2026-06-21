import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { SelectedSpinnerValue } from './selected-spinner-value.entity';

@Entity({ name: 'spinner_colors' })
export class SpinnerColor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'color_name' })
  colorName: string;

  @Column({ name: 'color_slug', unique: true })
  colorSlug: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => SelectedSpinnerValue, (value) => value.color)
  selectedSpinnerValues: SelectedSpinnerValue[];
}
