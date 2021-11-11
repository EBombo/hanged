import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownOutlined,
  EditOutlined,
  EyeOutlined,
  GoldOutlined,
  InfoCircleOutlined,
  LeftOutlined,
  LoadingOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  PoweroffOutlined,
  RightOutlined,
  UploadOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React from "reactn";

export const Icon = (props) => {
  const IconList = (type) => {
    switch (type) {
      case "edit":
        return <EditOutlined {...props} />;
      case "right":
        return <RightOutlined {...props} />;
      case "left":
        return <LeftOutlined {...props} />;
      case "info-circle":
        return <InfoCircleOutlined {...props} />;
      case "eye":
        return <EyeOutlined {...props} />;
      case "gold":
        return <GoldOutlined {...props} />;
      case "poweroff":
        return <PoweroffOutlined {...props} />;
      case "delete":
        return <DeleteOutlined {...props} />;
      case "upload":
        return <UploadOutlined {...props} />;
      case "check-circle":
        return <CheckCircleOutlined {...props} />;
      case "close-circle":
        return <CloseCircleOutlined {...props} />;
      case "plus":
        return <PlusOutlined {...props} />;
      case "calendar":
        return <CalendarOutlined {...props} />;
      case "copy":
        return <CopyOutlined {...props} />;
      case "plus-circle":
        return <PlusCircleOutlined {...props} />;
      case "arrow-right":
        return <ArrowRightOutlined {...props} />;
      case "arrow-left":
        return <ArrowLeftOutlined {...props} />;
      case "loading":
        return <LoadingOutlined {...props} />;
      case "user":
        return <UserOutlined {...props} />;
      case "down":
        return <DownOutlined {...props} />;
      case "minus-circle":
        return <MinusCircleOutlined {...props} />;
      default:
        return <GoldOutlined {...props} />;
    }
  };

  return IconList(props.type);
};
