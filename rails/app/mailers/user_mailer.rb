class UserMailer < ApplicationMailer
  default from: 'admin@5mpos.co'
  def password_reset_email(user, password)
    @user = user
    @password = password
    @login_url = url_for("#{root_url}login")
    mail(to: @user.email, subject: 'Your calbuilds Password')
  end

  def new_user_email(user)
    @user = user
    mail(to: @user.email, subject: 'Welcome to calbuilds')
  end

  def edit_approved_email(edit)
    @edit = edit
    mail(to: @edit.user.email, subject: 'Your Edit in calbuilds Was Approved')
  end
end
