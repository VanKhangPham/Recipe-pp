"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Icon } from "@/components/ui/icon";
import { MealPlannerMobile } from "@/components/mobile/meal-planner-mobile";
import { useMealPlanner } from "@/lib/context/meal-planner-context";

interface Meal {
  id: string;
  name: string;
  calories: string;
  time: string;
  image?: string;
}

interface DayPlan {
  date: string;
  dayName: string;
  calories: string;
  caloriePercent: number;
  isToday?: boolean;
  breakfast?: Meal;
  lunch?: Meal;
  dinner?: Meal;
  snack?: Meal;
}

const INITIAL_DAYS: DayPlan[] = [
  {
    date: "18 Thg 03",
    dayName: "Thứ Hai",
    calories: "1.820 kcal",
    caloriePercent: 91,
    breakfast: {
      id: "m1",
      name: "Phở bò tái lăn",
      calories: "420 kcal",
      time: "25p",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCXtKjoyqX-KCiLgWg5AIwCzjcFyTrwrwXsGFOsNY6Ji7kQteYybJ-bYEHNhkXcR8jyhFI1aEC1-q7chCtvOs8d9qUxtZL8ryf2ava_B1eySQjUqPkVC7WN-imEE3sNAqNeGgWnVPTSiIGLFUuT3uOaMk94x25cdozgyjADQwNMxTzfd6qlOA0GMJoCH5dltjfc9MXzxabjoptDjKi_2rQ2UpuwgaqNBdalkGLAy38s",
    },
    lunch: {
      id: "m2",
      name: "Cơm tấm sườn bì",
      calories: "680 kcal",
      time: "35p",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCiaKDJe-7VkS-5GR56Ir9wmosspT3X1Xn0_o82Ggcd-oZzKzc_-m_mY_ZbY3fqKw96yfNrkBbqx_7Q0qcJfcpyD9VMr51FRoSQc3HiD4BUmKgQ-k8fKJVG-0OHJSHWNRgKh-z4-fRYAO1QDPUn-jDxgMVWBNyZ6y1UfbwOaIh7E0GtnZbywW1ac7bBTLwKzJEmSksTLw4NDlErhesoQ2JDnyIS8iqv4JfT0eyDBqWn",
    },
    dinner: {
      id: "m3",
      name: "Cá lóc kho tộ",
      calories: "540 kcal",
      time: "30p",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAmM4PeqNlNu4Ab4wKscgk9MVN8a1FlboFr-8FTJQav7mmJiE9hM9yc2dHs6iQsDfsWfpvT9dTFCjg6pX8amFUZZrS8ATiOdRhwU7w9yo6Db4bYakx7ntvxzYku-TvodI0MBxfRjmnJnN10kWgBcqGNNSFArVR5PZEubH0MyPZkktYfS1oJF8Z7Lls1Tk5F2d5_hfpDdWkn17Ccj79R46WdMmRn4yp_r5jtz0RLlwYl",
    },
    snack: {
      id: "m4",
      name: "Chè sen long nhãn",
      calories: "180 kcal",
      time: "10p",
    },
  },
  {
    date: "19 Thg 03",
    dayName: "Thứ Ba",
    calories: "1.750 kcal",
    caloriePercent: 88,
    breakfast: {
      id: "m5",
      name: "Bánh mì ốp la pate",
      calories: "390 kcal",
      time: "15p",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBPJLJLwg6g5XvoEyMxLpHvx781GCbAsde5Cj9eLvyFolAdTt_bze19N33bT6gyzHiE0L4RH6pXk1EbpKHo7fwldRfR09kLQ3g9DS3vqsPX-YE38Ju8ogNbQT-S9Zgpil28SFrxopY9Fe1TlKnSGhAeJtk_F3jhXU3__K8Krv1XuqiBPivmp06Bs9oEswIJ6uYp2zN7xoS_4l604ary7elEvkOMsUeA1xBCsUBNMPq",
    },
    lunch: {
      id: "m6",
      name: "Sườn xào chua ngọt",
      calories: "610 kcal",
      time: "30p",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDs5KdNJJFDIrwHjXYSkRZq9r9GVvaJlFPnXgTr_deC5h8Lzgfi2EwEO95-hbSjUNqdi2i9ex2JfxIjN7Ymbhnl_F89125-PL0beVS2IlVy5GtLZZsL9Q4CTTHwpNZmu8NLuuwSTkOQDJ3lY74W-w2ojKdyI_8KOLHL-ex-HDSE2SumJveDsk2AgN22xuUTrvTWt8PncOOrp8wPJR-LscWyZPK9R5OK97PSBT1a8YK1",
    },
    dinner: {
      id: "m7",
      name: "Canh sườn nấu sấu",
      calories: "460 kcal",
      time: "35p",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCCCKOQP01VJ25Ey0WHkcDrpXjSiUBzdWRb4IluVA6qLU-D1iG3_wPfRPjpUIFLEpJ0Ulo8xxuTyJXs2qp9g6T953wGxG-9lSqV3vRO4sRQ2x-ocELRS_e99BP26A76UUTyEXULk8doTd6Jaqr6ndJipX1Xg0Rr7kYh3vmHbofcy0eI9dJXmugG9Q62ekv-1dfZDO4T1sh-bFPAi28sa2iHeWeTBCoCdNyhfxEMCVZJ",
    },
  },
  {
    date: "20 Thg 03",
    dayName: "Thứ Tư",
    calories: "1.890 kcal",
    caloriePercent: 95,
    isToday: true,
    breakfast: {
      id: "m8",
      name: "Bún mọc sườn non",
      calories: "450 kcal",
      time: "25p",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuANPZqSQ2LJaG3gYIE_Lm-CQiLg-IbF3F9QJh2NxBi2P16yd7adqREMenLOq_pH0FZMfjAoEdmCMtmHpNDTqPrmyLo6Ye9yLGsTXCM4RW-hFor1GMPyWwpVZN92DHhCnjIl_pVcDGcm_79x7XW8IkXkQTrfev_2kVeWmatGCzOp3fhZI9Jsz46F6u-dqcHy8e2jnjn0yS8xMAY78xpaTUTzr9__FTti8yyd_L3eQmri",
    },
    lunch: {
      id: "m9",
      name: "Bò kho bánh mì",
      calories: "670 kcal",
      time: "40p",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVY0V2nw3BbtDQXSeIo3Lqusc8hawZpiF-J_ac3Or7DqDjabx58n5nNPek1fa2xg4GyUOXYr5f0RkwhLbxAUjWvhKu0rw8lc0VaOZYG978IRh_OP7Ls0JhDY5plQxP-9k4Fb3JIfayfI8gchoq-QSf4umXl9CRKDe2CE2dWNHPpVhEUIxO_V-mXM9UbngNCDBYCrf3zovDH6Idpv_T-mggMpRCuk5t-WR_mYmjUT1I",
    },
    dinner: {
      id: "m10",
      name: "Gà rang gừng lá chanh",
      calories: "530 kcal",
      time: "30p",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWyU7N0zo0DLmTCPcPOrc6s5oJf56xPRdm1P3pLyAN5UtK71fbvrjw1omYdeTFt0WUbZZUfBeVNEsfydITmNdOLvfRArSWGVdLXgdp2apJR5ZYyt4SwdiVHSMKLxSu0Wwic1Q9xDDCmncG-kGV0Znr2BMXhDAPmP54VNGk7BEQbSZzBZzd3RMxvsJT1Zm-A6SIVo2_ZDFGLdDhf90S6orsiUlq4ApokQQAZkNg-7OE",
    },
    snack: {
      id: "m11",
      name: "Sữa chua dầm dâu",
      calories: "140 kcal",
      time: "5p",
    },
  },
  {
    date: "21 Thg 03",
    dayName: "Thứ Năm",
    calories: "1.690 kcal",
    caloriePercent: 84,
    breakfast: {
      id: "m12",
      name: "Xôi xéo mỡ hành",
      calories: "440 kcal",
      time: "15p",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjDJRnYfxRPqE6Xk15MpxDKAzdpuv9mXNoi0h6NiDabrKz5NwuW_lFp3uagp3WAMP_KbaY4X5XLqWOBxJAvxxTJu3vzhjoYZFYXVfBTQWIPZYgjZXtlVxk1Um7aNGyxTQHQ2Cfg__6XOrDrQ1sBSfJrnLGnHKWwEgFP7k5SgQDFaUfU_aR2r2gczKjlFHDoWvyIzBJOBtTF7dJKISsOjJ9g_m_ihDh25hloCdABxna",
    },
    lunch: {
      id: "m13",
      name: "Canh chua cá lóc",
      calories: "480 kcal",
      time: "30p",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYjjEyBujUUBZGcSYrkAgQm--3atvno2xMaJvQLxaJUSnOcrimuM8NXw3gH32m8RnqBamFzFtc0Rw5YZQbadmilUQUxzlr9WssT6csfblbbJyrFNTTn0QA5jnCLCHw27BwaaulSkUIFvZ2v00GlXA2q4OLz9aUqq6DigcEJOBZyXZY91eyoNjfIyt00B4p57BjnSOa62k1H-Llq1UqwNjhgYkqgkqVb0lDRu9YY3mg",
    },
    dinner: {
      id: "m14",
      name: "Tôm rim mặn ngọt",
      calories: "520 kcal",
      time: "20p",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAVPRUp2oTcbIZph8HlhUFz3Ci1yqKysNBo0_LT8HmClVKD6Q7dSBIJ8oErgFPOeqv4DqkCnZmVG8t3OKyk_qBltKzX77i7xX82wp0zS-367grvHueVmAO9QX-Czx4EoWa4wEj3HyIZxujdmEKRfUzitjNl3LyuvxZDHROC9doJlaeOLqWi_xHYw6iB3l3sVdDiI6LdafVLmjrC9PCobRBUGIj53JMcvh9gDANLzejO",
    },
  },
  {
    date: "22 Thg 03",
    dayName: "Thứ Sáu",
    calories: "1.780 kcal",
    caloriePercent: 89,
    breakfast: {
      id: "m15",
      name: "Cháo sườn sụn quẩy",
      calories: "360 kcal",
      time: "20p",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAo_PChll3fZxusVTLz6wWLBJefZiKp6oV6Q7WjP7HW8jDPA2d8OMsFtmhLF8YiEH8Pe3pKE0Nqr7xVPE2GQqFxkCjDAYZDwtaT6VlCHB9tD4R68v-JkJT5bFXG_50CT9Kelg4va2HZmIevPeoqYf9JEf68o_hn4UXYMFGc7WbzvtYL36gKBg1eLku1qHxMclDolDWBteDBz14ESxjnUIReKFGigtDGTzwJtPVvdT4",
    },
    lunch: {
      id: "m16",
      name: "Bún chả Hà Nội",
      calories: "630 kcal",
      time: "40p",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDZWJlPqMrUieFpLZ0oT-TasTMX1WUexEeE_FbDviBslP_Rk6E_j0WW0KFjYDHT_ICngQtRqs7Oj-B_CsmwQz6kWYHy156uXp0ptd_4Wws-CF6T688jOcRMsA_q3aDaqwUdastfNSQnWESQMKziDCEQfUHoMkYMjh6bkRg5Jf_RciA4qgmEBLD1tYEwPQhugZ6aDMwRxyY0mTNIb6j7mcvtxyynI7fL5Npm_3CaOJgh",
    },
    dinner: {
      id: "m17",
      name: "Trứng cuộn rau củ",
      calories: "480 kcal",
      time: "15p",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0OqGDJAwxWU3pt6zASEbOhGXOqEsncrdjWf5qv0o2njJHcaORI9igqksnjkhgsNiGr9q4qDuHM1cPNmbwi5Q0yW4r8wqlqEbfBwQdv8d-CcfXaqEt2usa6o4KphliC75h6e-Y27_vJAf2VZTjLlBIJGKTvKWFQyFhWNvMPWavFIfBV6rbcwPlgSVAK-OVsuvPlgJB9zq1ndYJrPzzForTXm-Wsvrssy1VBfzW5R6m",
    },
    snack: {
      id: "m18",
      name: "Nước ép dưa hấu",
      calories: "120 kcal",
      time: "5p",
    },
  },
  {
    date: "23 Thg 03",
    dayName: "Thứ Bảy",
    calories: "1.920 kcal",
    caloriePercent: 96,
    breakfast: {
      id: "m19",
      name: "Bánh cuốn chả quế",
      calories: "410 kcal",
      time: "20p",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfGyBFsvHohZJMqwKOf_bkBLzG0NsUZSAJggVSGM14zt6gcYjNkU877-rQaNKN0_ckNZrXdSlL3sOmGn_IVeE46HPlrgi4J30gk5nEkbuXY8NQyAaLjBk70syMsKcp1H_VPdiW68ikwAIL3MhdTUzuzdppMn4aI3zeqKT_4ZiqzN1J4WDvU8oaiREWl0Pid0W8RtS4Vy4Lj7ALrYNr_Xl7EAQyCvTzSdAL1WmlYnRT",
    },
    lunch: {
      id: "m20",
      name: "Bò nhúng dấm cuốn bánh tráng",
      calories: "720 kcal",
      time: "45p",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxmFqW4rYbGQ69JxriSNm8UrsefyYFpQKbE8aCEcUzDFkCAz-AlIBXsBxYvwk_aylap-EvRiGg70Uxx0dQL-h3q7Xk5VFOyXWmmbBWKzMGaON3ttGThOc2WvnUWVaGabESU5EQLZ1ib6xQUNlE_WmSimF3cLr5Q5DHnMg1om511FC9_1QwBRFLpjhsOuZFUrAG7Bnu_Acog_g2ZI74s9hMs-zybvxibAsF5fVlnJHO",
    },
    snack: {
      id: "m21",
      name: "Chè khúc bạch",
      calories: "210 kcal",
      time: "10p",
    },
  },
  {
    date: "24 Thg 03",
    dayName: "Chủ Nhật",
    calories: "1.480 kcal",
    caloriePercent: 74,
    breakfast: {
      id: "m22",
      name: "Bún thang phố cổ",
      calories: "440 kcal",
      time: "35p",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPXHz4HxyXtHZdQs2xbnA4dE9CevExBFRnz3ISiUZXAamgDSC-_1FyzgWYhtXZlfz0P4z6PkNPr6L_PnOnpyxrPQaQhlCBC-PS-Po1e8e4A0DxnRranitD_cp87GzBY-wtIlJ_tJpzqSodBugNJc5y3G1kURSNSxoMwDMcqpSzW0hfVu_KNf0_N8s8TPmsyfXxVi4jVn_Kqfzk-i1w0sjP9HUYwEwu2QPz5pUlrB4A",
    },
    lunch: {
      id: "m23",
      name: "Lẩu gà lá é",
      calories: "680 kcal",
      time: "50p",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-NmizYytdZxKUHOXsUqiLZ2oYvX1ty1qw-JukmsUlbwqjo2paW_h63GF0-m-YvnN3MF0GQCeNDmBkHN8AD3stgJonYiyPpXu4FMmOsXmH85Y4iefrURiq6AlTyokfikWV4m2Exu9L5BJoRK7vk1dNXj3bc76-CvXLZUgDQq0uMEhfu93VvaqR_3xNwMncJG4OdtypYIEjKHASKieUH0elhUCRVX7yaE66QmGD-B2K",
    },
  },
];

const DRAWER_RECIPES = [
  {
    id: "dr1",
    name: "Bún bò Huế",
    calories: "450 kcal",
    time: "35p",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtCvA5NyuIPbUou0Qu9nx8E0z3U6ZPqh_YoebSQaCkmpoewAKMDibL-D3tVmpVeOwOKJrwkPnrRoOv9AXTWGYewHfj0yxSIe2nmno43ptPexSMoLxtIBzDnQdK_kZeEFixj0kEH6P6Gl754d_Zdxyp2m7r076ubEWp7MCCmZkUfwKUpuaM-bf_CAqnuwYobri-h3N-Zgcp4xZVPARk0xHOD-sg4oQHS7wvC3UNruPj",
  },
  {
    id: "dr2",
    name: "Bánh xèo tôm nhảy",
    calories: "380 kcal",
    time: "25p",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-i7UnEJbKWikXdKklGjxemqV71HHflzDiB0-gGDjjgEjxWRlm49FGScmB_Hz_dEJqeMFlMnvVpVOcZs4cWTgM6GIKYTDD_Oau2PtfC4bYFBaGNGFWyIj2nLYaSCTT1I1JFsCoAffzToofOoQWGZwL9AFhcY1iOFO2LF2ESqTmCpZik_mcLTkxXaOyw8oA4CZ_7FAA3Encj3UiZnKV5Li9JtsLGrSmGhpusOvk2jO3",
  },
  {
    id: "dr3",
    name: "Gỏi cuốn tôm thịt",
    calories: "210 kcal",
    time: "15p",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAcNbayRNIzNGffs7VMjlzCX-0KztoZBhYXzF6vwQsu1TROPr-pyJfHrHG_EIxDRSRJLrdthmvXKJLtU7i-Pnq2NfFEPD4B-VUtWA-HeZ7_mKjX5I82IW0yq8VxF_jU5IZ2Qu42bWdzgGHdLvoDNRr8Mb6r_MOgxWbaA6VUe3btNcC8D4nMn9iWILHsHSFkaluTdrvb_B8lKXdqweJikGo54vLUe6ALM2kzneQofJKB",
  },
  {
    id: "dr4",
    name: "Canh bí đỏ thịt bằm",
    calories: "160 kcal",
    time: "20p",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCRNVWNXvi3BLGLlaecP05yh3tWhvv8i8DMxGGLi6pR781tzwXj0Tj8U4Gr6pvBXwcFpJNWMxP1QkG__ionZpfrKwFnvAKL3BknSbKzCgmbQKLNn2CXYg70EBmVdpdUMZZtKYmuZbB-xB3vs2XKwf4CFtSV9OGtGDrjcnKo9-zCsDBQRrYQF050P0ARmq-FsC-omN7_R0R5d6vrp9_DuC44rLt9uLZ1PTLkJ8hyQNF3",
  },
  {
    id: "dr5",
    name: "Canh nấm hạt sen chay",
    calories: "140 kcal",
    time: "25p",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6VycPjLq2nQhQ4JM27693xHnNlgGVybRiVvyeRzydva_PTO7K0e8Ujbz5HYHOVDZytVqtAeLCS7CvBNmrBdweVwFILSgWs49w6oycLa5MolL6LTI6vNJk05C4RKiJfSSEHZKiEYl-rJ2iKJJTOUT1lSL_v888YIbZG7u5Zibom74vTeczrbHSs6uQ8ASwIq6qlVMchalbIl9iIEjhSCc8m4Kp79mWeW5-1pD5sbAA",
  },
];

export default function MealPlannerPage() {
  const router = useRouter();
  const { generateShoppingList } = useMealPlanner();
  const [showBanner, setShowBanner] = React.useState(true);
  const [days, setDays] = React.useState<DayPlan[]>(INITIAL_DAYS);
  const [drawerTab, setDrawerTab] = React.useState<"fav" | "suggest" | "quick">("fav");
  const [searchDrawer, setSearchDrawer] = React.useState("");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleRemoveMeal = (dayIdx: number, mealType: "breakfast" | "lunch" | "dinner" | "snack") => {
    setDays((prev) => {
      const copy = [...prev];
      copy[dayIdx] = { ...copy[dayIdx], [mealType]: undefined };
      return copy;
    });
    showToast("Đã xóa món khỏi lịch");
  };

  const handleAddMealFromDrawer = (recipeName: string) => {
    showToast(`Đã thêm "${recipeName}" vào lịch tuần (Lưu máy)`);
  };

  return (
    <>
    {/* ═══════ MOBILE LAYOUT ═══════ */}
    <div className="md:hidden">
      <MealPlannerMobile />
    </div>

    {/* ═══════ DESKTOP LAYOUT ═══════ */}
    <div className="hidden md:flex bg-background font-body-md text-body-md text-on-surface min-h-screen flex-col antialiased selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Navbar />

      <main className="w-full pt-20 bg-background flex-1">
        <div className="flex flex-col w-full">
          {/* BANNER KHÁCH & ĐỒNG BỘ CLOUD */}
          {showBanner && (
            <section className="w-full px-gutter pt-space-md">
              <div
                className="w-full bg-surface-container-low rounded-xl p-space-md shadow-sm transition-all duration-300"
                id="guest-sync-banner"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
                  <div className="flex items-center gap-space-sm min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 text-primary">
                      <Icon name="save_as" className="text-[20px]" />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-title-md text-title-md text-on-surface">
                          Chế độ khách
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-label-mono-sm">
                          Bộ nhớ cục bộ (Local)
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        Toàn bộ kế hoạch tuần này đang được lưu trên thiết bị của bạn. Hãy tạo tài
                        khoản để tự động đồng bộ sang điện thoại và chia sẻ cùng gia đình.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-space-sm shrink-0 w-full md:w-auto justify-end">
                    <button
                      className="inline-flex items-center gap-2 px-space-md py-2 rounded-xl bg-primary text-on-primary font-body-md text-body-md font-medium shadow-sm hover:bg-primary-container transition-all"
                      onClick={() => showToast("Chuyển tới đăng nhập...")}
                      type="button"
                    >
                      <Icon name="sync" className="text-[18px]" />
                      <span>Đăng nhập để đồng bộ</span>
                    </button>
                    <button
                      aria-label="Đóng thông báo"
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors"
                      onClick={() => setShowBanner(false)}
                      type="button"
                    >
                      <Icon name="close" className="text-[18px]" />
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* THANH ĐIỀU HƯỚNG TUẦN & TÁC VỤ CHÍNH */}
          <section className="w-full px-gutter pt-space-lg">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-md pb-space-md">
              {/* Điều hướng tuần */}
              <div className="flex flex-wrap items-center gap-space-sm">
                <div className="flex items-center bg-surface-container rounded-xl p-1 shadow-sm">
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                    title="Tuần trước"
                    type="button"
                  >
                    <Icon name="chevron_left" className="text-[20px]" />
                  </button>
                  <div className="px-space-md py-1 flex items-center gap-2">
                    <Icon name="calendar_month" className="text-[18px] text-primary" />
                    <span className="font-title-md text-title-md text-on-surface tracking-tight">
                      Tuần này: 18/03 – 24/03/2024
                    </span>
                  </div>
                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                    title="Tuần sau"
                    type="button"
                  >
                    <Icon name="chevron_right" className="text-[20px]" />
                  </button>
                </div>
                <button
                  className="px-space-md py-2 rounded-xl bg-surface-container-low text-on-surface hover:bg-surface-container-high font-body-md text-body-md transition-colors shadow-sm"
                  type="button"
                >
                  Hôm nay
                </button>
                <div className="h-6 w-[1px] bg-surface-variant hidden sm:block mx-1"></div>
                <div className="flex items-center gap-1.5">
                  <button
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-lowest text-on-surface-variant hover:text-on-surface font-body-sm text-body-sm shadow-sm transition-colors"
                    onClick={() => showToast("Đã sao chép kế hoạch sang tuần tiếp theo!")}
                    title="Sao chép tuần này sang tuần sau"
                    type="button"
                  >
                    <Icon name="content_copy" className="text-[16px]" />
                    <span>Sao chép tuần</span>
                  </button>
                  <button
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-lowest text-on-surface-variant hover:text-error font-body-sm text-body-sm shadow-sm transition-colors"
                    onClick={() => {
                      setDays((prev) =>
                        prev.map((d) => ({
                          ...d,
                          breakfast: undefined,
                          lunch: undefined,
                          dinner: undefined,
                          snack: undefined,
                          calories: "0 kcal",
                          caloriePercent: 0,
                        }))
                      );
                      showToast("Đã xóa toàn bộ thực đơn tuần");
                    }}
                    title="Xóa toàn bộ thực đơn tuần"
                    type="button"
                  >
                    <Icon name="delete_sweep" className="text-[16px]" />
                    <span>Xoá tuần</span>
                  </button>
                  <button
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-lowest text-on-surface-variant hover:text-primary font-body-sm text-body-sm shadow-sm transition-colors"
                    title="Mục tiêu calo"
                    type="button"
                  >
                    <Icon name="tune" className="text-[16px]" />
                    <span>Mục tiêu calo</span>
                  </button>
                </div>
              </div>

              {/* CTA Nổi bật: Tạo danh sách mua sắm */}
              <div className="flex items-center gap-space-sm self-start xl:self-auto">
                <button
                  type="button"
                  className="inline-flex items-center gap-2.5 px-space-lg py-2.5 rounded-xl bg-secondary text-on-secondary font-body-md text-body-md font-semibold shadow-md hover:bg-on-secondary-container transition-all transform active:scale-95 cursor-pointer"
                  onClick={() => {
                    const count = generateShoppingList();
                    showToast(`Đã tự động tạo danh sách đi chợ với ${count} nguyên liệu từ thực đơn!`);
                    setTimeout(() => router.push("/shopping-list"), 800);
                  }}
                >
                  <Icon name="shopping_cart_checkout" className="text-[20px]" />
                  <span>Tạo danh sách mua sắm từ kế hoạch</span>
                  <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-label-mono-sm font-bold">
                    Tự động gộp
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* NỘI DUNG CHÍNH: LƯỚI LỊCH KẾ HOẠCH & NGĂN KÉO MÓN ĂN NHANH */}
          <section className="w-full px-gutter pt-space-xs pb-space-xl">
            <div className="grid grid-cols-1 2xl:grid-cols-12 gap-space-lg items-start">
              {/* CỘT CHÍNH: LƯỚI 7 NGÀY */}
              <div className="2xl:col-span-9 w-full flex flex-col gap-space-md">
                <div className="w-full overflow-x-auto pb-4 scrollbar-none">
                  <div className="grid grid-cols-7 gap-3 min-w-[1100px]">
                    {days.map((day, dIdx) => (
                      <div
                        key={day.date}
                        className={`flex flex-col rounded-2xl p-3 shadow-sm min-h-[720px] ${
                          day.isToday
                            ? "bg-gradient-to-b from-primary-fixed/20 via-surface-container-lowest to-surface-container-lowest border border-primary/20"
                            : "bg-surface-container-lowest"
                        }`}
                      >
                        {/* Header ngày */}
                        <div
                          className={`flex flex-col pb-2.5 mb-2.5 border-b ${
                            day.isToday ? "border-primary/20" : "border-surface-container"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`font-label-mono-sm text-label-mono-sm ${
                                day.isToday
                                  ? "text-primary font-semibold"
                                  : "text-on-surface-variant font-medium"
                              }`}
                            >
                              {day.date}
                            </span>
                            {day.isToday && (
                              <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-mono-sm text-label-mono-sm font-semibold">
                                Hôm nay
                              </span>
                            )}
                          </div>
                          <span
                            className={`font-headline-sm text-headline-sm text-on-surface ${
                              day.isToday ? "font-bold" : ""
                            }`}
                          >
                            {day.dayName}
                          </span>
                          <div className="mt-2 flex items-center justify-between text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                            <span className={day.isToday ? "font-semibold text-primary" : ""}>
                              {day.calories}
                            </span>
                            <span
                              className={`font-semibold ${
                                day.isToday ? "text-primary" : "text-secondary"
                              }`}
                            >
                              {day.caloriePercent}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-surface-container rounded-full mt-1 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                day.isToday ? "bg-primary" : "bg-secondary"
                              }`}
                              style={{ width: `${day.caloriePercent}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Danh sách bữa trong ngày */}
                        <div className="flex flex-col gap-3 flex-1">
                          {/* Bữa sáng */}
                          <div className="flex flex-col gap-1">
                            <span
                              className={`font-label-mono-sm text-label-mono-sm uppercase tracking-wider ${
                                day.isToday ? "text-primary font-semibold" : "text-on-surface-variant"
                              }`}
                            >
                              Sáng
                            </span>
                            {day.breakfast ? (
                              <div className="bg-surface-container-low rounded-xl p-2 shadow-sm hover:shadow-md transition-shadow group relative">
                                {day.breakfast.image && (
                                  <div className="w-full h-20 rounded-lg overflow-hidden relative mb-1.5">
                                    <Image
                                      src={day.breakfast.image}
                                      alt={day.breakfast.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <span className="font-title-md text-body-md text-on-surface font-semibold line-clamp-1">
                                  {day.breakfast.name}
                                </span>
                                <div className="flex items-center justify-between mt-1 text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                                  <span>{day.breakfast.calories}</span>
                                  <span>{day.breakfast.time}</span>
                                </div>
                                <button
                                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-surface-container-lowest/80 text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                                  onClick={() => handleRemoveMeal(dIdx, "breakfast")}
                                  type="button"
                                >
                                  <Icon name="close" className="text-[14px]" />
                                </button>
                              </div>
                            ) : (
                              <button
                                className="w-full py-3.5 rounded-xl border border-dashed border-outline-variant hover:border-primary hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all flex items-center justify-center gap-1.5"
                                onClick={() => showToast("Chọn món từ ngăn kéo bên phải để thêm")}
                                type="button"
                              >
                                <Icon name="add_circle" className="text-[18px]" />
                                <span className="font-body-sm text-body-sm font-medium">
                                  Thêm món
                                </span>
                              </button>
                            )}
                          </div>

                          {/* Bữa trưa */}
                          <div className="flex flex-col gap-1">
                            <span
                              className={`font-label-mono-sm text-label-mono-sm uppercase tracking-wider ${
                                day.isToday ? "text-primary font-semibold" : "text-on-surface-variant"
                              }`}
                            >
                              Trưa
                            </span>
                            {day.lunch ? (
                              <div className="bg-surface-container-low rounded-xl p-2 shadow-sm hover:shadow-md transition-shadow group relative">
                                {day.lunch.image && (
                                  <div className="w-full h-20 rounded-lg overflow-hidden relative mb-1.5">
                                    <Image
                                      src={day.lunch.image}
                                      alt={day.lunch.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <span className="font-title-md text-body-md text-on-surface font-semibold line-clamp-1">
                                  {day.lunch.name}
                                </span>
                                <div className="flex items-center justify-between mt-1 text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                                  <span>{day.lunch.calories}</span>
                                  <span>{day.lunch.time}</span>
                                </div>
                                <button
                                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-surface-container-lowest/80 text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                                  onClick={() => handleRemoveMeal(dIdx, "lunch")}
                                  type="button"
                                >
                                  <Icon name="close" className="text-[14px]" />
                                </button>
                              </div>
                            ) : (
                              <button
                                className="w-full py-3.5 rounded-xl border border-dashed border-outline-variant hover:border-primary hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all flex items-center justify-center gap-1.5"
                                onClick={() => showToast("Chọn món từ ngăn kéo bên phải để thêm")}
                                type="button"
                              >
                                <Icon name="add_circle" className="text-[18px]" />
                                <span className="font-body-sm text-body-sm font-medium">
                                  Thêm món
                                </span>
                              </button>
                            )}
                          </div>

                          {/* Bữa tối */}
                          <div className="flex flex-col gap-1">
                            <span
                              className={`font-label-mono-sm text-label-mono-sm uppercase tracking-wider ${
                                day.isToday ? "text-primary font-semibold" : "text-on-surface-variant"
                              }`}
                            >
                              Tối
                            </span>
                            {day.dinner ? (
                              <div className="bg-surface-container-low rounded-xl p-2 shadow-sm hover:shadow-md transition-shadow group relative">
                                {day.dinner.image && (
                                  <div className="w-full h-20 rounded-lg overflow-hidden relative mb-1.5">
                                    <Image
                                      src={day.dinner.image}
                                      alt={day.dinner.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <span className="font-title-md text-body-md text-on-surface font-semibold line-clamp-1">
                                  {day.dinner.name}
                                </span>
                                <div className="flex items-center justify-between mt-1 text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                                  <span>{day.dinner.calories}</span>
                                  <span>{day.dinner.time}</span>
                                </div>
                                <button
                                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-surface-container-lowest/80 text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                                  onClick={() => handleRemoveMeal(dIdx, "dinner")}
                                  type="button"
                                >
                                  <Icon name="close" className="text-[14px]" />
                                </button>
                              </div>
                            ) : (
                              <button
                                className="w-full py-6 rounded-xl border border-dashed border-outline-variant hover:border-primary hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all flex flex-col items-center justify-center gap-1.5"
                                onClick={() => showToast("Chọn món từ ngăn kéo bên phải để thêm")}
                                type="button"
                              >
                                <Icon name="add_circle" className="text-[20px]" />
                                <span className="font-body-sm text-body-sm font-medium">
                                  Thêm món tối
                                </span>
                              </button>
                            )}
                          </div>

                          {/* Bữa phụ */}
                          <div className="flex flex-col gap-1">
                            <span
                              className={`font-label-mono-sm text-label-mono-sm uppercase tracking-wider ${
                                day.isToday ? "text-primary font-semibold" : "text-on-surface-variant"
                              }`}
                            >
                              Phụ / Vặt
                            </span>
                            {day.snack ? (
                              <div className="bg-surface-container-low rounded-xl p-2 shadow-sm flex items-center justify-between">
                                <div className="min-w-0 pr-1">
                                  <p className="font-body-sm text-body-sm text-on-surface font-medium truncate">
                                    {day.snack.name}
                                  </p>
                                  <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                                    {day.snack.calories}
                                  </span>
                                </div>
                                <button
                                  className="text-on-surface-variant hover:text-error p-1"
                                  onClick={() => handleRemoveMeal(dIdx, "snack")}
                                  title="Xóa"
                                  type="button"
                                >
                                  <Icon name="close" className="text-[16px]" />
                                </button>
                              </div>
                            ) : (
                              <button
                                className="w-full py-3.5 rounded-xl border border-dashed border-outline-variant hover:border-primary hover:bg-surface-container text-on-surface-variant hover:text-primary transition-all flex items-center justify-center gap-1.5"
                                onClick={() => showToast("Chọn món từ ngăn kéo bên phải để thêm")}
                                type="button"
                              >
                                <Icon name="add_circle" className="text-[18px]" />
                                <span className="font-body-sm text-body-sm font-medium">
                                  Thêm món
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* CỘT BÊN PHẢI: KHO MÓN ĂN NHANH ĐỂ XẾP LỊCH */}
              <aside className="2xl:col-span-3 w-full bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col gap-space-md 2xl:sticky 2xl:top-24">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon name="auto_stories" className="text-[20px] text-primary" />
                    <h3 className="font-title-md text-title-md text-on-surface font-semibold">
                      Kho món xếp lịch
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                    24 món sẵn
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Kéo thả trực tiếp vào ô bữa ăn trong lịch hoặc bấm nút{" "}
                  <span className="font-semibold text-primary">+</span> để xếp nhanh.
                </p>

                {/* Ô Tìm Kiếm Món Nhanh */}
                <div className="relative">
                  <input
                    className="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant font-body-sm text-body-sm pl-9 pr-3 py-2 rounded-xl border-none focus:outline-none focus:ring-1 focus:ring-primary shadow-inner"
                    placeholder="Tìm món nhanh..."
                    type="text"
                    value={searchDrawer}
                    onChange={(e) => setSearchDrawer(e.target.value)}
                  />
                  <Icon
                    name="search"
                    className="text-[18px] text-on-surface-variant absolute left-2.5 top-2.5"
                  />
                </div>

                {/* Tabs Bộ Lọc Nhanh */}
                <div className="flex items-center gap-1 p-1 bg-surface-container-low rounded-xl">
                  <button
                    className={`flex-1 py-1 text-center rounded-lg font-body-sm text-body-sm transition-colors ${
                      drawerTab === "fav"
                        ? "bg-surface-container-lowest text-on-surface font-semibold shadow-xs"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                    onClick={() => setDrawerTab("fav")}
                    type="button"
                  >
                    Yêu thích (12)
                  </button>
                  <button
                    className={`flex-1 py-1 text-center rounded-lg font-body-sm text-body-sm transition-colors ${
                      drawerTab === "suggest"
                        ? "bg-surface-container-lowest text-on-surface font-semibold shadow-xs"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                    onClick={() => setDrawerTab("suggest")}
                    type="button"
                  >
                    Gợi ý
                  </button>
                  <button
                    className={`flex-1 py-1 text-center rounded-lg font-body-sm text-body-sm transition-colors ${
                      drawerTab === "quick"
                        ? "bg-surface-container-lowest text-on-surface font-semibold shadow-xs"
                        : "text-on-surface-variant hover:text-on-surface"
                    }`}
                    onClick={() => setDrawerTab("quick")}
                    type="button"
                  >
                    &lt; 20 phút
                  </button>
                </div>

                {/* Danh sách Thẻ Mini Recipe Cards */}
                <div className="flex flex-col gap-2.5 max-h-[580px] overflow-y-auto pr-1">
                  {DRAWER_RECIPES.filter((r) =>
                    r.name.toLowerCase().includes(searchDrawer.toLowerCase())
                  ).map((recipe) => (
                    <div
                      key={recipe.id}
                      className="p-2.5 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex items-center gap-3 cursor-grab active:cursor-grabbing group"
                    >
                      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 relative">
                        <Image
                          src={recipe.image}
                          alt={recipe.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-body-md text-body-md text-on-surface font-semibold truncate group-hover:text-primary transition-colors">
                          {recipe.name}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5 text-on-surface-variant font-label-mono-sm text-label-mono-sm">
                          <span>{recipe.calories}</span>
                          <span>•</span>
                          <span>{recipe.time}</span>
                        </div>
                      </div>
                      <button
                        className="w-8 h-8 rounded-lg bg-surface-container-lowest text-primary hover:bg-primary hover:text-on-primary flex items-center justify-center shrink-0 shadow-xs transition-colors"
                        onClick={() => handleAddMealFromDrawer(recipe.name)}
                        title="Thêm vào kế hoạch"
                        type="button"
                      >
                        <Icon name="add" className="text-[18px]" />
                      </button>
                    </div>
                  ))}
                </div>

                <Link
                  className="text-center font-body-sm text-body-sm text-primary hover:underline font-semibold mt-auto pt-2"
                  href="/recipes"
                >
                  Khám phá thêm 1.400+ công thức ẩm thực →
                </Link>
              </aside>
            </div>
          </section>

          {/* TỔNG KẾT DINH DƯỠNG TUẦN */}
          <section className="w-full px-gutter pb-space-xl">
            <div className="w-full bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
                {/* Thông số dinh dưỡng trung bình */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Icon name="monitor_heart" className="text-[20px] text-secondary" />
                    <span className="font-title-md text-title-md text-on-surface font-semibold">
                      Tóm tắt dinh dưỡng trung bình tuần
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-mono-sm text-label-mono-sm font-semibold">
                      Đạt chuẩn gia đình 4 người
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xl">
                    Kế hoạch bữa ăn cân đối tốt giữa chất xơ và đạm thực vật/động vật. Năng lượng
                    tiêu chuẩn phù hợp người làm việc công sở và học sinh.
                  </p>

                  {/* Lưới số liệu Macro */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-md mt-2">
                    <div className="bg-surface-container-low rounded-xl p-3">
                      <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                        Năng lượng / ngày
                      </span>
                      <p className="font-headline-sm text-headline-sm text-on-surface font-bold mt-0.5">
                        1.820 <span className="text-body-sm font-normal">kcal</span>
                      </p>
                    </div>
                    <div className="bg-surface-container-low rounded-xl p-3">
                      <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                        Chất đạm (Protein)
                      </span>
                      <p className="font-headline-sm text-headline-sm text-on-surface font-bold mt-0.5">
                        85 <span className="text-body-sm font-normal">g/ngày</span>
                      </p>
                    </div>
                    <div className="bg-surface-container-low rounded-xl p-3">
                      <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                        Chất béo (Fat)
                      </span>
                      <p className="font-headline-sm text-headline-sm text-on-surface font-bold mt-0.5">
                        52 <span className="text-body-sm font-normal">g/ngày</span>
                      </p>
                    </div>
                    <div className="bg-surface-container-low rounded-xl p-3">
                      <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
                        Tinh bột (Carbs)
                      </span>
                      <p className="font-headline-sm text-headline-sm text-on-surface font-bold mt-0.5">
                        215 <span className="text-body-sm font-normal">g/ngày</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Biểu đồ Donut SVG & Link xem phân tích chi tiết */}
                <div className="flex flex-col sm:flex-row items-center gap-space-lg shrink-0 lg:border-l lg:border-surface-container lg:pl-space-xl">
                  {/* Visual Donut chart */}
                  <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-surface-container"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></path>
                      <path
                        className="text-primary"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeDasharray="50, 100"
                        strokeWidth="4"
                      ></path>
                      <path
                        className="text-secondary"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeDasharray="30, 100"
                        strokeDashoffset="-50"
                        strokeWidth="4"
                      ></path>
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="font-label-mono-sm text-label-mono-sm text-on-surface font-bold">
                        100%
                      </span>
                      <span className="text-[10px] text-on-surface-variant">Cân đối</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      className="inline-flex items-center gap-1.5 px-space-md py-2.5 rounded-xl bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors font-body-md text-body-md font-semibold text-center shadow-xs"
                      onClick={() => showToast("Báo cáo phân tích dinh dưỡng tuần: Tỉ lệ đạt 100%")}
                      type="button"
                    >
                      <Icon name="analytics" className="text-[18px] text-primary" />
                      <span>Xem chi tiết phân tích</span>
                    </button>
                    <span className="font-body-sm text-body-sm text-on-surface-variant text-center">
                      Bao gồm vi chất &amp; vitamin
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Toast Notification */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 z-50 transition-all duration-300">
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-xl font-body-sm text-body-sm">
                <Icon name="check_circle" className="text-[18px] text-secondary" />
                <span>{toastMessage}</span>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
    </>
  );
}
