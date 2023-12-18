class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  enum role: [:admin, :verified, :municipal, :user, :disabled]
  before_save :ensure_authentication_token
  has_many :edits
  has_many :developments
  has_many :flags
  after_initialize :set_default_role, if: :new_record?
  after_create :new_user_email
  after_save :update_agency

  private
  def ensure_authentication_token
    if authentication_token.blank?
      self.authentication_token = generate_authentication_token
    end
  end

  def generate_authentication_token
    loop do
      token = Devise.friendly_token
      break token unless User.where(authentication_token: token).first
    end
  end

  def new_user_email
    UserMailer.new_user_email(self).deliver_later if User.first.created_at > Date.today.beginning_of_day
  end

  def set_default_role
    self.role ||= :user
  end

  def update_agency
    return if municipality.nil? || municipality=='STATE'
    logger.debug municipality
    rpa_query = <<~SQL
      SELECT upper(acronym) as agency FROM places p JOIN rpas r 
      ON st_contains(r.shape, st_centroid(p.geom)) 
      WHERE position('#{self.municipality}' in upper(namelsad))>0;      
    SQL
    sql_result = ActiveRecord::Base.connection.exec_query(rpa_query).to_a[0]
    return if sql_result.blank?
    self.update_columns(agency: sql_result['agency'])
  end

  
end
