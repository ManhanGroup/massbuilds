import Component from '@ember/component';
import config from 'calbuilds/config/environment';
import { action, computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';
import fetch from 'fetch';

export default class extends Component {
  @service notifications;

  constructor() {
    super();

    this.classNames = [
      'component',
      'subpanel',
      'form-subpanel',
      'password-reset-subpanel',
    ];

    this.username = '';
    this.password = '';
    this.password_confirmation = '';

    this.errorMessage = null;
    this.isResetting = false;
    this.loadingText = 'Resetting Password';
  }

  @computed
  checkParams() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('reset_password_token')) {
      return true;
    } else {
      return false;
    }
  }

  @computed('username', 'password', 'password_confirmation')
  get submittable() {
    if (this.get('checkParams')) {
      return (
        this.get('password') !== '' && this.get('password_confirmation') !== ''
      );
    } else {
      return this.get('username') !== '';
    }
  }

  @action
  requestResetPassword() {
    if (this.get('submittable') && !this.get('isResetting')) {
      this.set('isResetting', true);
      this.set('errorMessage', null);

      const email = this.get('username');

      fetch(`${config.host}/password_resets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email
        })
      })
        .then(() => {
          this.get('notifications').show(
            `You have successfully requested to reset your password for ${email}! Please check your email.`
          );
          this.sendAction('redirect');
        })
        .catch(() => {
          this.set(
            'errorMessage',
            'We could not reset your password at this time.'
          );
        })
        .finally(() => {
          this.set('isResetting', false);
        });
    }
  }

  @action
  updatePassword() {
    if (this.get('submittable') && !this.get('isResetting')) {
      this.set('isResetting', true);
      this.set('errorMessage', null);

      const urlParams = new URLSearchParams(window.location.search);
      fetch(`${config.host}/my/users/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/vnd.api+json',
          'accept': 'application/vnd.api+json',
        },
        body: JSON.stringify({
          data: {
            type: 'user',
            id: null,
            attributes: {
              password: this.get('password'),
              password_conformation: this.get('password_confirmation'),
              commit: 'Change my password',
              reset_password_token: urlParams.get('reset_password_token'),
            },
          },
        }),
      })
        .then(() => {
          this.get('notifications').show(
            'You have successfully reset your password! Please log in.'
          );
          this.sendAction('redirect');
        })
        .catch(() => {
          this.set(
            'errorMessage',
            'We could not reset your password at this time.'
          );
        })
        .finally(() => {
          this.set('isResetting', false);
        });
    }
  }
}
