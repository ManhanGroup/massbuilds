class ApplicationMailer < ActionMailer::Base
  default from: 'mailgun@mg.ywconsultinggroup.com'
  layout 'mailer'
end
