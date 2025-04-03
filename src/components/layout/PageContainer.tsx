
import React from "react";
import { Separator } from "@/components/ui/separator";

interface PageContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="container py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-2">{description}</p>
        )}
      </div>
      <Separator className="my-4" />
      {children}
    </div>
  );
};

export default PageContainer;
