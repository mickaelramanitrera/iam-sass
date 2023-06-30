"use server";

const LoginLayout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <div className="h-full w-full flex justify-center items-center">
    {children}
  </div>
);

export default LoginLayout;
