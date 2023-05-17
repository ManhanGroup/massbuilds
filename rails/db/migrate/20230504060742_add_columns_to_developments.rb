class AddColumnsToDevelopments < ActiveRecord::Migration[7.0]
  def change
    add_column :developments, :percomp_24, :integer
    add_column :developments, :percomp_28, :integer
    add_column :developments, :percomp_35, :integer
    add_column :developments, :percomp_45, :integer
    add_column :developments, :gluc, :text
    add_column :developments, :placetype, :text
    remove_column :developments, :aff_u30
    remove_column :developments, :aff_30_50
    remove_column :developments, :aff_80p
    add_column :developments, :aff_u50, :integer
    add_column :developments, :aff_80_120, :integer
    add_column :developments, :aff_120p, :integer
    remove_column :developments, :smmultifam
    remove_column :developments, :lgmultifam    
    add_column :developments, :multifam, :integer
    add_column :developments, :proj_id, :integer
    rename_column :developments, :mepa_id, :proj_id_
    rename_column :developments, :mepa_id_present, :proj_id_present
    add_column :developments, :stat_comts, :text
    add_column :developments, :mix_descr, :text
    add_column :developments, :notes, :text
    remove_column :developments, :height
    remove_column :developments, :stories
    remove_column :developments, :onsitepark
  end
end
