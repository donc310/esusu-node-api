import { GroupRepository, AccountInvitationRepository } from "../repositories";

import { check } from "express-validator";

const is_public = check("enabled").toBoolean();

export default {
  create: [
    check("name")
      .isString()
      .withMessage("group name is required")
      .custom(async (name) => {
        try {
          await new GroupRepository().findByColumn("name", name);
        } catch (e) {
          return true;
        }

        throw new Error("group name already exists.");
      }),
    check("savings_amount")
      .isNumeric()
      .withMessage("Saving amount must be a positive integer value"),
    check("maximum_member")
      .isNumeric()
      .withMessage("Maximum number must be a positive integer value"),
    check("description")
      .isString()
      .withMessage("Group description is required"),
    is_public,
  ],

  update: [
    check("name")
      .isString()
      .withMessage("name is required")
      .custom(async (name, { req }) => {
        const organizationId = req.params.organizationId;
        const organization = await new GroupRepository()
          .query()
          .where("name", name)
          .where("id", "<>", organizationId);

        if (organization.length === 0) return true;
        throw new Error("name already exists.");
      }),
    is_public,
  ],

  join: [
    check("token")
      .isString()
      .withMessage("Invitation Token is required.")
      .custom(async (token, { req }) => {
        let invitation;

        try {
          invitation = await new AccountInvitationRepository().findByColumn(
            "token",
            token
          );
        } catch (e) {
          if (e instanceof ModelNotFoundException)
            throw new Error("Invalid Invitation Token");
          console.error(e);
          throw new Error("Error validating input values");
        }

        const isValid = await invitation.verifyInvitation(req.user.email);
        if (!isValid) throw new Error("Invalid activation token");
        req.invitation = invitation;
        return true;
      }),
  ],

  invite: [
    check("email")
      .isString()
      .withMessage("Email is required.")
      .normalizeEmail()
      .isEmail()
      .withMessage("Invalid email format")
  ],

};
