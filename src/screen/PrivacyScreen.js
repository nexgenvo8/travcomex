import {StyleSheet, Text, View, SafeAreaView, ScrollView} from 'react-native';
import React from 'react';
import Header from './Header/Header';
import {useTheme} from '../theme/ThemeContext';
import {universityName} from './constants';

const PrivacyScreen = ({navigation}) => {
  const {isDark, colors, toggleTheme} = useTheme();
  const styles = createStyles(colors);
  return (
    <SafeAreaView
      style={{...styles.container, backgroundColor: colors.background}}>
      <Header title="Privacy" navigation={navigation} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Privacy Policy Notice</Text>
        <Text style={styles.text}>
          Our Privacy Policy explains how {universityName} collects, uses, and
          discloses information about you. The terms “{universityName},” “we,”
          “us,” and “our” include {universityName}, Inc. and our affiliates. We
          use the terms “member,” “you,” and “your” to mean any person using our
          Platform or attending related events, including any organization or
          person using the Platform on an organization’s behalf.
        </Text>

        <Text style={styles.text}>
          This Privacy Policy applies to the processing of information about
          members and other individuals that we collect when you use our
          “Platform,” which means any website, application, or services we
          offer, or when you communicate with us.
        </Text>

        <Text style={styles.text}>
          For information about choices that we offer under this policy, please
          see “Your Choices” below. This Privacy Policy does not apply to the
          information that you may provide to third parties, such as members,
          and others with whom you may share information about yourself.
        </Text>

        <Text style={styles.subtitle}>Collection of Information</Text>
        <Text style={styles.subsection}>1.1 Information You Provide to Us</Text>

        <Text style={styles.text}>
          We collect information that you provide directly to us. For example,
          we collect information that you provide when you create an account,
          choose interests or groups, fill out a form, or communicate with us.
        </Text>

        <Text style={styles.text}>
          The types of information that we may collect include your name,
          username, password, email address, postal address, phone number,
          payment method data, photos, choices of interests and groups, and any
          other information that you choose to provide.
        </Text>

        <Text style={styles.text}>
          Information about your gender and interests is optional. Your choice
          of groups is optional, but we are required to process this information
          to administer your account, and to indicate that you are a member of
          the groups that you join.
        </Text>

        <Text style={styles.text}>
          On occasion, the information that you give us when you join a group
          may imply information about your beliefs, political views, health
          conditions, or your sexual identity. This, and other kinds of
          sensitive information, is given special protection. Posting personal
          or sensitive information about yourself or others is against our
          Community Guidelines.
        </Text>

        <Text style={styles.subtitle}>
          Information We Collect Automatically When You Use the Platform
        </Text>

        <Text style={styles.text}>
          Log Information: We collect log information about your use of the
          Platform, including the type of browser that you use; the time,
          duration and frequency of your access; Platform pages viewed; your IP
          address; and the page you visited before visiting our Platform.
        </Text>

        <Text style={styles.text}>
          Device Information: We collect information about the computer or
          mobile device that you use to access our Platform, including the
          hardware model, operating system and version, unique device
          identifiers, and mobile network information.
        </Text>
        <Text style={styles.text}>
          Location Information: We may collect information about the location of
          your device each time you use our Platform based on your consent to
          the collection of this information. For further information see
          Section 5.2.
        </Text>

        <Text style={styles.subtitle}>
          Information Collected by Cookies and Other Tracking Technologies:
        </Text>

        <Text style={styles.text}>
          We and our service providers collect information using various
          technologies, including cookies and pixel tags (which are also called
          clear GIFs, web beacons, or pixels). Cookies are small data files
          stored on your hard drive or in device memory that help us improve our
          Platform and your experience, and track usage of our Platform. Pixel
          tags are electronic images that may be used in our Platform or emails,
          and track usage of our Platform and effectiveness of communications.
          You can learn more about the types of cookies we and our service
          providers use by reading our Cookie Policy.
        </Text>

        <Text style={styles.subsection}>
          Other Information:{' '}
          <Text style={styles.text}>
            With your permission, we may collect other information from your
            device, such as photos from your camera roll, contacts of
            individuals you wish to find or connect with, or calendar
            information you want to manage via the Platform.
          </Text>
        </Text>

        <Text style={styles.subsection}>
          1. Information We Collect from Other Sources
        </Text>

        <Text style={styles.text}>
          We may collect information about you from other sources, such as
          through certain features on the Platform you elect to use, but only
          where these third parties either have your consent or are otherwise
          legally permitted or required to disclose your information to us.
          Examples include -:
        </Text>
        <Text style={styles.subsection}>
          Invitations-:{' '}
          <Text style={styles.text}>
            If another member sends you an invitation through our Platform, we
            may receive certain personal information, such as your name, email
            address, or phone number. If you are an invited guest, we will
            automatically send you an invitation to our Platform, and, if
            unanswered, a one-time follow-up invitation. {universityName} stores
            this contact information only to send these invitations and evaluate
            their success. You may unsubscribe from future invitations using the
            instructions in those messages. You may also contact us at privacy
            VECOSPACE.com to request that we remove this information from our
            database.
          </Text>
        </Text>
        <Text style={styles.subsection}>
          MemberContent-:{' '}
          <Text style={styles.text}>
            We may receive information about you when you or another member
            uploadphoto or posts other content to the Platform. For further
            details about the rights over this information available to
            individuals.
          </Text>
        </Text>
        <Text style={styles.subsection}>
          Information from Other Third-Party Sources-:{' '}
          <Text style={styles.text}>
            In order to provide you with more tailored recommendations, we may
            obtain information about you from publicly and commercially
            available sources and other third parties as permitted by law. For
            more information about the data that we obtain from these providers,
            please contact us at privacy@{universityName}.com.
          </Text>
        </Text>
        <Text style={styles.subsection}>2. Use of Information</Text>
        <Text style={styles.subsection}>2.1 Operating our Platform</Text>
        <Text style={styles.subsection}>
          We may use information about you for various purposes related to
          operating our Platform, including to:
        </Text>
        <Text style={styles.text}>
          1. Provide, maintain, and improve our Platform, including to process
          transactions, develop new products and services, and manage the
          performance of our Platform;
        </Text>
        <Text style={styles.text}>
          2. Display information about you, for instance, your list of
          interests, which will be visible on your profile;
        </Text>
        <Text style={styles.text}>
          3. Personalize the Platform, for example, to suggest content in which
          we think you may be interested (including content given special
          protection under EU law or that relates to sensitive topics such as
          health, political opinions, religion, and sexual identity);
        </Text>
        <Text style={styles.text}>
          4. Provide you with better recommendations;
        </Text>
        <Text style={styles.text}>
          5. Monitor and analyse trends, usage, and activities in connection
          with our Platform; and
        </Text>
        <Text style={styles.text}>
          6. Detect, investigate, and prevent fraudulent transactions, abuse,
          and other illegal activities; to protect the rights, property, or
          safety of {universityName} and others; to enforce compliance with our
          policies; and to comply with applicable law and government requests.
        </Text>
        <Text style={styles.text}>
          7.Perform accounting and administrative tasks and enforce or manage
          legal claims.
        </Text>
        <Text style={styles.subsection}>2.2 Communicatingwith You </Text>
        <Text style={styles.subsection}>
          We may use information about you for various purposes related to
          communicating with you, including to:
        </Text>
        <Text style={styles.text}>
          1.Respond to your comments, questions, and requests, and provide
          customer service;
        </Text>
        <Text style={styles.text}>
          2.Communicate with you, in accordance with your account settings,
          about products, services, and events offered by us and others, to
          provide news and information that we think will be of interest to you,
          to conduct online surveys, to contact you about events on our Platform
          that are being held near your location, and to otherwise communicate
          with you in accordance with Section 2.3;
        </Text>
        <Text style={styles.text}>
          3.Notify you about communications of other members, in accordance with
          the communication preferences that you indicate in your account; and
          customer service;
        </Text>
        <Text style={styles.text}>
          4.Send you technical notices, updates, security alerts and support,
          and administrative messages.
        </Text>
        <Text style={styles.subsection}>2.3 Advertising and Other Uses </Text>
        <Text style={styles.subsection}>
          We may use information about you for various other purposes, including
          to:
        </Text>
        <Text style={styles.text}>
          1.Provide content, features, or sponsorships that match member
          profiles or interests;
        </Text>
        <Text style={styles.text}>
          2.Facilitate contests and other promotions;
        </Text>
        <Text style={styles.text}>
          3.Combine with information that we collect for the purposes described
          in this Privacy Policy; and
        </Text>
        <Text style={styles.text}>
          4.Carry out any other purposes described to you at the time that we
          collected the information.
        </Text>

        <Text style={styles.subsection}>2.4 Legal Basis for Processing </Text>
        <Text style={styles.subsection}>
          Our legal basis for collecting and using the information described
          above will depend on the type of information and the specific context
          in which we collect it.
        </Text>

        <Text style={styles.text}>
          1.We process information about you to provide our services in
          accordance with our Terms of Service, for example to allow you to join
          groups, or to display your profile to other members, and to allow us
          to send you important service updates.
        </Text>
        <Text style={styles.text}>
          2.We also process information about you where it is in our legitimate
          interests to do so and not overridden by your rights (for example, in
          some cases for direct marketing, fraud prevention, network and
          information systems security, responding to your communications, the
          operation of networks of groups by the network administrators, and
          improving our Platform).
        </Text>
        <Text style={styles.text}>
          3.Sometimes you provide us with sensitive information about you; for
          instance, the mere fact of joining a certain group may indicate
          information about your health, religion, political views, or sexual
          identity. Joining such groups or posting information on the Platform
          about these topics is entirely voluntarily and done with your explicit
          consent.
        </Text>
        <Text style={styles.text}>
          4.In some cases, we may also have a legal obligation to collect
          information about you or may otherwise need the information to protect
          your vital interests or those of another person.
        </Text>
        <Text style={styles.text}>
          5.We may also process information to comply with a legal requirement
          or to perform a contract.
        </Text>

        <Text style={styles.subsection}>3. Sharing of Information </Text>
        <Text style={styles.subsection}>3.1 Through Our Platform</Text>
        <Text style={styles.text}>
          We share some of the information that we collect by displaying it on
          our Platform according to your member profile and account settings.
          Some information, such as user name, is always public. Some
          information, such as interests, is public by default, but can be
          hidden on our Platform. Some information, such as group memberships,
          will always be visible to other members of that {universityName}{' '}
          group, and may be public, depending on the settings of that group. We
          recommend that you check the group settings and what information will
          be available before joining the group to ensure that you are happy
          with the information that is visible to others.
        </Text>
        <Text style={styles.subsection}>3.2 Group Networks</Text>
        <Text style={styles.text}>
          If you are a member of a group, this group may now or in the future
          become part of a network of groups known as a “{universityName} Pro”
          network. Members who administer a {universityName} Pro network, known
          as “network administrators” have access to the content within their
          groups. Network administrators find it helpful to have access to the
          email addresses of organizers and other members of groups within their
          networks, to easily communicate with and administer the groups.
          Therefore, we may ask if you want to share your email address with
          your group’s network administrator.
        </Text>
        <Text style={styles.subsection}>3.3 WeWork Locations</Text>
        <Text style={styles.subsection}>3.4 With Our Service Providers</Text>
        <Text style={styles.text}>
          We may use service providers in connection with operating and
          improving the Platform to assist with certain functions, such as
          payment processing, email transmission, conducting surveys or
          contests, data hosting, managing our ads, and some aspects of our
          technical and customer support. We take measures to ensure that these
          service providers access, process, and store information about you
          only for the purposes we authorize, subject to confidentiality
          obligations.
        </Text>
        <Text style={styles.subsection}>
          3.5 Following the Law and Protecting {universityName}
        </Text>
        <Text style={styles.text}>
          We may access, preserve, and disclose information about you to third
          parties, including the content of messages, if we believe disclosure
          is in accordance with, or required by, applicable law, regulation,
          legal process, or audits. We may also disclose information about you
          if we believe that your actions are inconsistent with our Terms of
          Service or related guidelines and policies, or if necessary to protect
          the rights, property, or safety of, or prevent fraud or abuse of, JMI
          VECOSPACE or others.
        </Text>
        <Text style={styles.subsection}>3.6 Sharing and Other Tools</Text>
        <Text style={styles.text}>
          The Platform may offer sharing features and other integrated tools
          which let you share activities that you take on our Platform with
          third-party services, and vice versa. Such features let you share
          information with your contacts, depending on the settings you have
          chosen with the service. The third-party services' use of the
          information will be governed by the third-parties’ privacy policies,
          and we do not control the third-parties’ use of the shared data. For
          more information about the purpose and scope of data collection and
          processing in connection with social sharing features, please review
          the privacy policies of the services that provide these features.
        </Text>
        <Text style={styles.subsection}>
          3.7 Affiliate Sharing and Merger, Sale, Or Other Asset Transfers
        </Text>
        <Text style={styles.text}>
          If {universityName} is involved in a merger, acquisition, financing,
          reorganization, bankruptcy, or sale of our assets, information about
          you may be shared, sold, or transferred as part of that transaction.
          We may also share information about you with current or future
          corporate parents, subsidiaries, or affiliates.
        </Text>
        <Text style={styles.subsection}>3.8 Other Situations</Text>
        <Text style={styles.text}>
          We may de-identify or aggregate information about you and share it
          freely, so that you can no longer be identified. We may also share
          information about you with your consent or at your direction or where
          we are legally entitled to do so.
        </Text>
        <Text style={styles.subsection}>4. Additional Information</Text>
        <Text style={styles.subsection}>
          4.1 Analytics and Advertising Services Provided by Others
        </Text>
        <Text style={styles.text}>
          With your permission, we may allow others to use cookies, web beacons,
          device identifiers, and other technologies to collect information
          about your use of the Platform and other websites and online services.
          See ourCookie Policyfor details about these technologies and the
          information that they collect, use, or share, including how you may be
          able to control or disable these services.
        </Text>
        <Text style={styles.subsection}>4.2 Security</Text>
        <Text style={styles.text}>
          We employ technical and organizational measures designed to
          appropriately protect your information that is under our control and
          that we process on your behalf from unauthorized access collection,
          use, disclosure, copying, modification or disposal, both during
          transmission and once we receive it. We store all information that you
          provide to us on secure servers. We train employees regarding our data
          privacy policies and procedures and permit authorized employees to
          access information on a need to know basis, as required for their
          role. We use firewalls designed to protect against intruders and test
          for network vulnerabilities. However, no method of transmission over
          the internet or method of electronic storage is completely secure.
          Where you have a password, which enables you to use our services, you
          are responsible for keeping this password complex, secure, and
          confidential. If you would like to update or change your password, you
          may select the “Forgot your password?” link on the login page. You
          will be sent an email that allows you to reset your password.
        </Text>
        <Text style={styles.subsection}>4.3 Data Retention</Text>
        <Text style={styles.text}>
          We may temporarily block your account if you have not logged in for
          six months or more. You may contact us if you wish to reactivate your
          account.We retain certain information that we collect from you while
          you are a member of the Platform, and in certain cases where you have
          deleted your account, for the following reasons: You can use our
          Platform; To ensure that we do not communicate with you if you have
          asked us not to; To provide you with a refund, if entitled; To provide
          accurate accounting information to other members about the groups that
          they organize or administer, and associated memberships; To better
          understand the traffic to our Platform so that we can provide all
          members with the best possible experience; To detect and prevent abuse
          of our Platform, illegal activities and breaches of our Terms of
          Service; and To comply with applicable legal, tax or accounting
          requirements. When we have no ongoing legitimate business need to
          process your information, we will either delete or anonymize it.
        </Text>
        <Text style={styles.subsection}>4.4 Policy Scope</Text>
        <Text style={styles.text}>
          This Privacy Policy does not apply to information that you provide to
          third parties, such as other members, including group organizers and
          network administrators, and others with whom you may share information
          about you. Our Platform may direct you to a third-party service, such
          as social media services, or a portion of our Platform may be
          controlled by a third party (typically using a frame or pop-up window
          separate from other content on our Platform). Disclosure of
          information to these third parties is subject to the relevant third
          party’s privacy policy. We are not responsible for the third-party
          privacy policy or content, even if we link to those services from our
          Platform or if we share information with these third parties. Members,
          including group organizers and network administrators, are directly
          responsible for complying with all requirements of applicable privacy
          laws as per their country in connection with the information that they
          obtain and process for the purposes of managing their contacts, or
          organizing groups, or administering networks
        </Text>
        <Text style={styles.subsection}>4.5 Revisions to This Policy</Text>
        <Text style={styles.text}>
          We may modify this Privacy Policy from time to time. When we do, we
          will provide notice to you by publishing the most current version and
          revising the date at the top of this page. If we make any material
          change to this policy, we will provide additional notice to you, such
          as by sending you an email or displaying a prominent notice on our
          Platform.
        </Text>
        <Text style={styles.subsection}>4.5 Revisions to This Policy</Text>
        <Text style={styles.text}>
          We may modify this Privacy Policy from time to time. When we do, we
          will provide notice to you by publishing the most current version and
          revising the date at the top of this page. If we make any material
          change to this policy, we will provide additional notice to you, such
          as by sending you an email or displaying a prominent notice on our
          Platform.
        </Text>
        <Text style={styles.subsection}>5. Your Choices</Text>
        <Text style={styles.subsection}>
          5.1 Your Choices: Account Information
        </Text>
        <Text style={styles.text}>
          You may update or correct your account information by editing your
          account settings or by sending a request to privacy@{universityName}
          .com as described inYou may deactivate your account by editing your
          account settings or by sending an email to privacy@JMIVECOSPACE.com.
          You will also be able to choose what information others see about you
          and who may contact you by using the Privacy Settings section in your
          Account.
        </Text>
        <Text style={styles.subsection}>
          5.2 Your Choices: Location Information
        </Text>
        <Text style={styles.text}>
          When you first access the Platform, we will collect information about
          your location, which we use to make better recommendations for groups
          and events in your area, and to improve our Platform. If you do not
          want us to collect information about your location, then you can
          prevent this: If using a mobile app, by changing the settings on your
          device. If using our website, your location data will be obtained via
          a cookie. Please refer to our Cookie Policyfor additional information
          on how to manage our use of cookies.
        </Text>
        <Text style={styles.subsection}>
          Note that our Platform or its features may no longer function properly
          if you do.
        </Text>
        <Text style={styles.text}>
          Your mobile device settings may also give you the option to choose
          whether to allow us to view your location on a continuous basis, when
          only using the app, or never. Allowing us to view your location when
          you are not using the app allows us to provide you with
          recommendations on a regular basis. Please refer to your device’s
          guide for additional information on how to adjust location services.
        </Text>
        <Text style={styles.subsection}>5.3 Your Choices: Cookies</Text>
        <Text style={styles.text}>
          We may use and allow others to use cookies, web beacons, device
          identifiers, and other technologies to collect information about your
          use of the Platform and other websites and online services. See
          ourCookie Policyfor details about these technologies and the
          information that they collect, use, or share, including how you may be
          able to control or disable these services.
        </Text>
        <Text style={styles.subsection}>
          5.4 Your Choices: Promotional Communications
        </Text>
        <Text style={styles.text}>
          You can control messages that you receive from {universityName}, other
          members, and third parties by selecting the unsubscribe link in the
          message that you receive, or by adjusting the communication
          preferences in your account settings. We will also send you a link to
          these settings when you first sign up and in subsequent messages. If
          you opt out, we may still send you non-promotional messages, such as
          those about your account or our ongoing business relations.
        </Text>
        <Text style={styles.subsection}>6. Data Rights</Text>
        <Text style={styles.text}>
          We respond to all requests that we receive from individuals who wish
          to exercise their data protection rights in accordance with applicable
          data protection laws. You can contact us by sending an email to
          privacy@{universityName}.com.
        </Text>
        <Text style={styles.subsection}>
          Rights that you may have, depending on the country in which you live,
          include:
        </Text>
        <Text style={styles.text}>
          Accessing, correcting, updating, or requesting deletion of your
          information.
        </Text>
        <Text style={styles.text}>
          Objecting to processing of your information, asking us to restrict
          processing of your information, or requesting the portability of your
          information.
        </Text>
        <Text style={styles.text}>
          Opting out from receiving marketing communications that we send you at
          any time. You can exercise this right by selecting the “unsubscribe”
          or “opt-out” link in the marketing emails we send you. Additionally,
          you may update your email preferences by changing the settings in your
          account.
        </Text>
        <Text style={styles.text}>
          Withdrawing your consent at any time if we have collected and
          processed your information with your consent. Withdrawing your consent
          will not affect the lawfulness of any processing that we conducted
          prior to your withdrawal, nor will it affect processing of your
          information conducted in reliance on lawful processing grounds other
          than consent.
        </Text>
        <Text style={styles.text}>
          Complaining to a data protection authority about our collection and
          use of your information. For more information, please contact your
          local data protection authority. Contact details for data protection
          authorities in the Indian Subcontinent are available here.
        </Text>
        <Text style={styles.text}>
          Other members, such as group organizers and network administrators,
          may also act as controllers of your information. You should contact
          these members if you have any questions about how they use information
          that you have provided to them.
        </Text>
        <Text style={styles.subsection}>7. Contact Us</Text>
        <Text style={styles.text}>
          Under Indian Subcontinent data protection law, the controller of your
          information is {universityName}, Inc.If you have any questions or
          complaints about this Privacy Policy or how we use your information,
          please contact privacy@{universityName}.com.
        </Text>
        <View style={{marginTop: 20}} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyScreen;

// const styles = StyleSheet.create({
const createStyles = colors =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      // flexGrow: 1,
      paddingHorizontal: 16,
      paddingVertical: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 12,
      color: colors.textColor,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: '600',
      marginTop: 16,
      marginBottom: 8,
      color: colors.textColor,
    },
    subsection: {
      fontSize: 16,
      fontWeight: '500',
      marginTop: 10,
      marginBottom: 6,
      color: colors.textColor,
    },
    text: {
      fontSize: 14,
      lineHeight: 22,
      marginBottom: 10,
      // color: '#333',
      color: colors.textColor,
    },
  });
