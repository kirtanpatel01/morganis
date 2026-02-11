
interface WelcomeEmailProps {
  storeName: string;
  adminEmail: string;
  adminPassword: string;
  loginUrl: string;
}

export const getWelcomeEmailTemplate = ({
  storeName,
  adminEmail,
  adminPassword,
  loginUrl,
}: WelcomeEmailProps) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
      <h2 style="color: #333333; text-align: center;">Welcome to Morganis!</h2>
      <p style="color: #555555; font-size: 16px;">Hello,</p>
      <p style="color: #555555; font-size: 16px;">
        We are excited to inform you that your store <strong>${storeName}</strong> has been successfully registered on the Morganis platform.
      </p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 0 0 10px; color: #333333; font-weight: bold;">Your Login Credentials:</p>
        <p style="margin: 5px 0; color: #555555;"><strong>Email:</strong> ${adminEmail}</p>
        <p style="margin: 5px 0; color: #555555;"><strong>Password:</strong> ${adminPassword}</p>
      </div>

      <div style="background-color: #fff3cd; border: 1px solid #ffeeba; color: #856404; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <strong>⚠️ Security Warning:</strong>
        <p style="margin: 5px 0 0;">
          For your security, please log in and change your password immediately. Do not share these credentials with anyone.
        </p>
      </div>

      <p style="color: #555555; font-size: 16px;">
        You can access your store dashboard here: <a href="${loginUrl}" style="color: #007bff; text-decoration: none;">Login to Dashboard</a>
      </p>
      
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
      
      <p style="color: #999999; font-size: 12px; text-align: center;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  `;
};

interface SuperAdminWelcomeEmailProps {
  adminEmail: string;
  adminPassword: string;
  loginUrl: string;
}

export const getSuperAdminWelcomeEmailTemplate = ({
  adminEmail,
  adminPassword,
  loginUrl,
}: SuperAdminWelcomeEmailProps) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
      <h2 style="color: #333333; text-align: center;">Welcome to Morganis!</h2>
      <p style="color: #555555; font-size: 16px;">Hello,</p>
      <p style="color: #555555; font-size: 16px;">
        You have been granted <strong>Super Admin</strong> access to the Morganis platform.
      </p>
      
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 0 0 10px; color: #333333; font-weight: bold;">Your Super Admin Credentials:</p>
        <p style="margin: 5px 0; color: #555555;"><strong>Email:</strong> ${adminEmail}</p>
        <p style="margin: 5px 0; color: #555555;"><strong>Password:</strong> ${adminPassword}</p>
      </div>

      <div style="background-color: #fff3cd; border: 1px solid #ffeeba; color: #856404; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <strong>⚠️ Security Warning:</strong>
        <p style="margin: 5px 0 0;">
          This account has elevated privileges. For your security, please log in and change your password immediately. Do not share these credentials with anyone.
        </p>
      </div>

      <p style="color: #555555; font-size: 16px;">
        You can access the Super Admin dashboard here: <a href="${loginUrl}" style="color: #007bff; text-decoration: none;">Login to Dashboard</a>
      </p>
      
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
      
      <p style="color: #999999; font-size: 12px; text-align: center;">
        This is an automated message. Please do not reply to this email.
      </p>
    </div>
  `;
};
