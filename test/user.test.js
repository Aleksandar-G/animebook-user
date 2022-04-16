jest.mock('../services/userService')

const userService = require('../services/userService')


describe("user actions", () => {


    test("create a user", async () => {

        const res = await userService.createUser("test_username","test_email","test_password");

        expect(res).toBe(true)
    });

    test("delete a user", async () => {

        const res = await userService.deleteUser("test_username");

        expect(res).toBe(true)
    });

    test("check user", async () => {

        const res = await userService.checkUser("test_username", "test_password");

        expect(res).toBe(true)
    });

    test("change password to a user", async () => {

        const res = await userService.changePassword("test_username", "newPassword");

        expect(res).toBe(true)
    });
});


