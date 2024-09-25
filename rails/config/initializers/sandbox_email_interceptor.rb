class SandboxEmailInterceptor
  def self.delivering_email(message)
    message.to = ['admin@5mpos.co']
  end
end

if Rails.env.staging? || Rails.env.development?
  #ActionMailer::Base.register_interceptor(SandboxEmailInterceptor)
end
