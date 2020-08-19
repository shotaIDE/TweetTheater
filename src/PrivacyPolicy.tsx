import "./App.css";

import { Card, Container, Link, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

import { officialTwitterAccountDidClick } from "./GoogleAnalyticsEvents";
import { officialTwitterAccountUrl } from "./OfficialAccountInfo";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
    },
    card: {
      maxWidth: 800,
      padding: theme.spacing(2),
    },
  })
);

interface Props {}

export const PrivacyPolicy = (props: Props) => {
  const classes = useStyles(props);

  const handleTwitterAccount = () => {
    officialTwitterAccountDidClick();
  };

  return (
    <Container className={classes.root}>
      <Card className={classes.card}>
        <Typography component="h1" variant="h4" align="center" paragraph={true}>
          プライバシーポリシー
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph={true}>
          本ウェブサイト上で提供するサービス「Tweet
          Theater」（以下、「本サービス」といいます。）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。
        </Typography>
        <Typography component="h2" variant="h5" paragraph={true}>
          第1条（個人情報を収集・利用する目的）
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph={true}>
          運営者が個人情報を収集・利用する目的は、以下のとおりです。
          <ol>
            <li>本サービスを提供するため</li>
            <li>
              ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）
            </li>
            <li>
              利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため
            </li>
          </ol>
        </Typography>
        <Typography component="h2" variant="h5" paragraph={true}>
          第2条（個人情報の第三者提供）
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph={true}>
          運営者は、個人情報保護法その他の法令で認められる場合を除き、第三者に個人情報を提供することはありません。
        </Typography>
        <Typography component="h2" variant="h5" paragraph={true}>
          第3条（個人情報の開示および削除）
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph={true}>
          運営者は、本人から個人情報の開示・削除等を求められたときは、合理的な期間内で、個人情報の開示・削除を行います。
        </Typography>
        <Typography component="h2" variant="h5" paragraph={true}>
          第4条（その他留意事項）
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph={true}>
          本サービスでは、Googleによるアクセス解析ツール「Googleアナリティクス」を使用しています。このGoogleアナリティクスはデータの収集のためにCookieを使用しています。このデータは匿名で収集されており、個人を特定するものではありません。
          この規約に関しての詳細は
          <Link href="https://marketingplatform.google.com/about/analytics/terms/jp/">
            Googleアナリティクスサービス利用規約ページ
          </Link>
          や
          <Link href="https://policies.google.com/technologies/ads?hl=ja">
            Googleポリシーと規約ページ
          </Link>
          をご覧ください。
        </Typography>
        <Typography component="h2" variant="h5" paragraph={true}>
          第5条（お問い合わせ窓口）
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph={true}>
          本ポリシーに関するお問い合わせは、
          <Link
            href={officialTwitterAccountUrl}
            target="_blank"
            referrerPolicy="noopener"
            onClick={handleTwitterAccount}
          >
            公式Twitter
          </Link>
          までお願いいたします。
        </Typography>
        <Typography variant="body1" color="textSecondary" align="right">
          2020年8月22日 制定・施行
        </Typography>
      </Card>
    </Container>
  );
};
