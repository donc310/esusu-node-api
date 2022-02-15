import { SYSTEM_ROLES as ROLES } from "../../constants/UserRoles"
import { UserModel }    from "../../app/models"
import factory          from "../../libraries/FakerFactories"

factory.define("users", UserModel, faker => ({
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: "secret",
    full_name: {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
    },
    role: faker.random.arrayElement(ROLES),
}))
