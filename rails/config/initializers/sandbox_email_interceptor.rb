class SandboxEmailInterceptor
  def self.delivering_email(message)
    message.to = ['gschmidt@ambag.org']
  end
end

if Rails.env.staging? || Rails.env.development?
  #ActionMailer::Base.register_interceptor(SandboxEmailInterceptor)
end
