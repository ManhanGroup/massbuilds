class TruncatedDevelopmentSerializer
  include FastJsonapi::ObjectSerializer
  set_type :development

  belongs_to :user

  [:id, :name, :status, :apn, :address, :year_compl, :yrcomp_est, :nhood, :municipal, :devlper, :ispublic].each { |attr| attribute attr }

  attribute :latitude do |object|
    object.point.try :y
  end

  attribute :longitude do |object|
    object.point.try :x
  end
end
