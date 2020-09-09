import { User } from '../user.entity';
import * as bcrypt from 'bcrypt';

describe('User entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.password = 'hashpassword';
    user.salt = 'testSalt';
  });

  describe('validatePassword', () => {
    it('returns true as password is valid', async () => {
      const spy = jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashpassword');
      const result = await user.validatePassword('123456');
      expect(spy).toHaveBeenCalledWith('123456', 'testSalt');
      expect(result).toEqual(true);
    });

    it('returns false as password is invalid', async () => {
      const spy = jest.spyOn(bcrypt, 'hash').mockResolvedValue('wrongPassword');
      const result = await user.validatePassword('wrongPassword');
      expect(spy).toHaveBeenCalledWith('wrongPassword', 'testSalt');
      expect(result).toEqual(false);
    });
  });
});
