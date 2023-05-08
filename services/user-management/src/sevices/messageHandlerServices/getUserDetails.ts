import User from '../../models/userModel.ts'

export const getUserDetails = async (data: any) => {
  try {
    const user = await User.findById(data.userId)
    return user
  } catch (error) {
    throw new Error(error)
  }
}