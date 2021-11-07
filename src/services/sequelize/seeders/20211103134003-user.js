import Sequelize from "sequelize";
import { User } from "../models";

export default {
  up: async () => {
    const [user, init] = await User.findOrBuild({
      where: { email: "mbapewe@gmail.com" },
      defaults: {
        name: "Permadi Wibisono",
        isEmailVerified: true,
      },
    });
    if (init) {
      await user.genPasswordHash("Test12345;$");
      await user.save();
    }
  },
  down: async () => {
    await User.destroy({
      where: { email: { [Sequelize.Op.in]: ["mbapewe@gmail.com"] } },
    });
  },
};
