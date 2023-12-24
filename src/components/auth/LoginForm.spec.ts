import { useAuthStore } from '@/stores/auth';
import type { LoginDto } from '@/types';
import { createTestingPinia } from '@pinia/testing';
import { shallowMount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import LoginForm from './LoginForm.vue';

describe('LoginForm.vue', () => {
  it('has form inputs', () => {
    const wrapper = shallowMount(LoginForm, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });
    expect(wrapper.find('#username').exists()).toBe(true);
    expect(wrapper.find('#password').exists()).toBe(true);
  });

  it('calls login on form submit', async () => {
    const div = document.createElement('div');
    div.id = 'root';
    document.body.appendChild(div);

    const wrapper = shallowMount(LoginForm, {
      attachTo: '#root',
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
          }),
        ],
      },
    });

    const store = useAuthStore();

    const loginDto: LoginDto = {
      username: 'some_user',
      password: 'some_password',
    };

    const usernameInput = wrapper.find('#username');
    await usernameInput.setValue(loginDto.username);
    const passwordInput = wrapper.find('#password');
    await passwordInput.setValue(loginDto.password);

    expect((usernameInput.element as HTMLInputElement).value).toBe(loginDto.username);
    expect((passwordInput.element as HTMLInputElement).value).toBe(loginDto.password);

    await wrapper.find('button').trigger('click');

    expect(store.login).toHaveBeenLastCalledWith(loginDto);
    wrapper.unmount();
  });
});