import { Request, Response } from "express";
import IProfileController from "../../interface/controller/investor/profileControllerInterface";
import { IProfileService } from "../../interface/service/profileInterface";
import HttpStatus from "../../utils/httpStatusCode";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { Messages } from "../../constants/messages";

export class ProfileController implements IProfileController {
  constructor(private _profileService: IProfileService) {}

  getProfile = async (req: Request, res: Response)=> {
    try {
      const { seekerId } = req.params;
      const { seeker, industryCategory } = await this._profileService.getProfile(seekerId);
      res.status(HttpStatus.OK).json({ seeker, industryCategory });
    } catch (error: unknown) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR,
      });
    }
  };

  updateProfileImage = async (req: Request, res: Response) => {
    try {
      const { seekerId } = req.params;
      const file = req.file as Express.Multer.File;

      if (!file) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "No file uploaded" });
        return;
      } 

      const updatedSeeker = await this._profileService.updateProfileImage(seekerId, file.path);
      res.status(HttpStatus.OK).json({ message: "Profile image updated successfully", seeker: updatedSeeker });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  };

  updateProfile = async (req: Request, res: Response)=> {
    try {
      const { seekerId } = req.params;
      const updatedData = req.body;
      const updated = await this._profileService.updateProfile(seekerId, updatedData);
      res.status(HttpStatus.OK).json({ message: Messages.PROFILE_UPDATED_SUCCESSFULLY, seeker: updated });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  };

  reapply = async (req: Request, res: Response) => {
    try {
      const { investorId } = req.params;
      await this._profileService.reapply(investorId);
      res.status(HttpStatus.OK).json({ success: true });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message });
    }
  };

  changePassword = async (req: Request, res: Response)=> {
    try {
      const { userId } = req.params;
      const { data } = req.body;

      await this._profileService.changePassword(userId, data.oldPassword, data.newPassword);

      res.status(HttpStatus.OK).json({ success: true, message: Messages.PASSWORD_UPDATED_SUCCESSFULLY });
    } catch (error: unknown) {
      console.error("Change password error:", error);
      const message = error instanceof Error ? error.message : ERROR_MESSAGES.SERVER_ERROR;
      res.status(HttpStatus.BAD_REQUEST).json({ message });
    }
  };


  
}
