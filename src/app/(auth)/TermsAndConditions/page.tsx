

'use client';

import Logo from '@/Components/Logo/page';
import React, { useState } from 'react';

const TermsAndConditions = () => {
  const [language, setLanguage] = useState('English');

  const ContentWrapper = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="w-full max-w-5xl mx-auto bg-white shadow-md rounded-xl p-6 text-gray-800">
      <div className="mb-4 flex justify-center">
        <Logo />
      </div>
         <div className="flex justify-end mb-6">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded"
        >
          <option value="English">English</option>
          <option value="Hindi">हिन्दी</option>
          <option value="Telugu">తెలుగు</option>
        </select>
      </div>
      <h1 className="text-2xl font-bold text-center mb-6">{title}</h1>
      <section className="space-y-4">{children}</section>
    </div>
  );

  const EnglishContent = () => (
    <ContentWrapper title="Terms and Conditions">
      <p>
        This agreement (“Healthcare Professional Service Contract”) is made between{' '}
        <strong>Curate Health Services LLP</strong>, located at H.No. 15/100030, Plot No. 4, Brindhavanam Colony,
        Beeramguda, Sangareddy, Telangana - 502032 (“Curate Health”) and the individual contractor (“Healthcare
        Professional”).
      </p>
      <h3 className="font-semibold">1. Background</h3>
      <p>
        Curate Health connects qualified Healthcare Professionals with clients in need of home care services. Contractors
        agree to provide these services based on a mutual agreement and are responsible for submitting accurate
        identification and qualification documents.
      </p>
      <h3 className="font-semibold">2. Agreement Terms</h3>
      <ul className="list-disc ml-6 space-y-1">
        <li>Agreement is effective from the date signed and continues until terminated with two weeks’ notice by either party.</li>
        <li>Contractors must stay on-site if the service demands and must notify managers before leaving client premises.</li>
        <li>Confidential client information must be protected during and after contract termination.</li>
      </ul>
      <h3 className="font-semibold">3. Payment Terms</h3>
      <ul className="list-disc ml-6 space-y-1">
        <li>Invoices are issued monthly, due within 7 days. Late fees of ₹500/day apply post due date.</li>
        <li>Annual fee increment of 10% may apply.</li>
        <li>Payments may be made via bank transfer, cheque, or prepaid cash cards.</li>
        <li>Curate Health may deduct accommodation fees or taxes as agreed.</li>
      </ul>
      <h3 className="font-semibold">4. Leaves and Replacement</h3>
      <p>
        Leaves must be approved in advance. Emergency or sick leaves will be managed per labor laws. Curate Health will
        attempt to provide a replacement in such cases.
      </p>
      <h3 className="font-semibold">5. Confidentiality & Data Use</h3>
      <ul className="list-disc ml-6 space-y-1">
        <li>Contractors agree to background checks and allow use of their data for verification and promotional material.</li>
        <li>Biometric data may be stored securely for legal liability.</li>
      </ul>
      <h3 className="font-semibold">6. Termination & Breach</h3>
      <ul className="list-disc ml-6 space-y-1">
        <li>Service can be terminated by either party with written notice (5-15 days depending on role).</li>
        <li>Unnotified exit or misconduct may incur a compensation fee of ₹50,000.</li>
        <li>Repeated absence or unacceptable behavior (drugs, alcohol, etc.) can lead to immediate termination.</li>
      </ul>
      <h3 className="font-semibold">7. Legal & Dispute Resolution</h3>
      <ul className="list-disc ml-6 space-y-1">
        <li>All disputes will be resolved under Telangana law.</li>
        <li>Jurisdiction is limited to Hyderabad courts only.</li>
        <li>Force majeure events (natural disaster, war, etc.) are acknowledged as valid for service disruption.</li>
      </ul>
      <h3 className="font-semibold">8. Non-Solicitation & Liability</h3>
      <ul className="list-disc ml-6 space-y-1">
        <li>Clients cannot hire healthcare professionals directly for 12 months post-contract termination.</li>
        <li>Curate Health is not liable for any theft or disputes arising at the client’s place.</li>
      </ul>
      <h3 className="font-semibold">9. Final Declaration</h3>
      <p>
        By enabling the CheckBox, the Contractor and Client acknowledge that they have read, understood, and voluntarily
        accepted all terms and conditions outlined above.
      </p>
    </ContentWrapper>
  );

  const HindiContent = () => (
    <ContentWrapper title="नियम और शर्तें">
      <p>
        यह समझौता ("हेल्थकेयर प्रोफेशनल सेवा अनुबंध") <strong>Curate Health Services LLP</strong> और एक स्वतंत्र सेवा
        प्रदाता ("हेल्थकेयर प्रोफेशनल") के बीच किया गया है।
      </p>
      <h3 className="font-semibold">1. पृष्ठभूमि</h3>
      <p>
        Curate Health योग्य हेल्थकेयर प्रोफेशनल्स को उन ग्राहकों से जोड़ता है जिन्हें होम केयर सेवाओं की आवश्यकता होती है।
        सेवा प्रदाता को सही पहचान और योग्यताओं से संबंधित दस्तावेज़ प्रस्तुत करने होंगे।
      </p>
      <h3 className="font-semibold">2. अनुबंध की शर्तें</h3>
      <ul className="list-disc ml-6 space-y-1">
        <li>अनुबंध हस्ताक्षर की तिथि से प्रभावी होगा और किसी भी पक्ष द्वारा दो सप्ताह की सूचना पर समाप्त किया जा सकता है।</li>
        <li>सेवा की आवश्यकता होने पर सेवा प्रदाता को ऑन-साइट रहना होगा और क्लाइंट स्थल छोड़ने से पहले प्रबंधकों को सूचित करना होगा।</li>
        <li>ग्राहक की गोपनीय जानकारी की सुरक्षा करनी होगी।</li>
      </ul>
      <h3 className="font-semibold">3. भुगतान शर्तें</h3>
      <ul className="list-disc ml-6 space-y-1">
        <li>मासिक बिल जारी होंगे, जिनका भुगतान 7 दिनों के भीतर करना होगा। देर से भुगतान पर ₹500/दिन का जुर्माना लगेगा।</li>
        <li>वार्षिक शुल्क में 10% की वृद्धि हो सकती है।</li>
        <li>भुगतान बैंक ट्रांसफर, चेक या प्रीपेड कैश कार्ड के माध्यम से किया जा सकता है।</li>
        <li>रहने का शुल्क या कर सहमति के अनुसार काटे जा सकते हैं।</li>
      </ul>
      <h3 className="font-semibold">4. छुट्टियाँ और प्रतिस्थापन</h3>
      <p>
        सभी छुट्टियों को पहले से अनुमोदित कराना आवश्यक है। आपातकालीन या बीमारी की छुट्टियों को श्रम कानूनों के अनुसार
        प्रबंधित किया जाएगा।
      </p>
      <h3 className="font-semibold">5. गोपनीयता और डेटा उपयोग</h3>
      <ul className="list-disc ml-6 space-y-1">
        <li>पृष्ठभूमि जांच के लिए सहमति आवश्यक है और डेटा का उपयोग प्रमाणीकरण एवं प्रचार सामग्री में किया जा सकता है।</li>
        <li>बायोमेट्रिक डेटा को कानूनी सुरक्षा के लिए सुरक्षित रखा जा सकता है।</li>
      </ul>
      <h3 className="font-semibold">6. समाप्ति और उल्लंघन</h3>
      <ul className="list-disc ml-6 space-y-1">
        <li>सेवा को किसी भी पक्ष द्वारा 5-15 दिनों की लिखित सूचना देकर समाप्त किया जा सकता है।</li>
        <li>बिना सूचना के छोड़ने या अनुचित आचरण पर ₹50,000 का जुर्माना लगाया जा सकता है।</li>
        <li>नियमित अनुपस्थिति या गलत व्यवहार पर तुरंत समाप्ति की जा सकती है।</li>
      </ul>
      <h3 className="font-semibold">7. कानूनी और विवाद समाधान</h3>
      <ul className="list-disc ml-6 space-y-1">
        <li>सभी विवादों को तेलंगाना कानून के अंतर्गत सुलझाया जाएगा।</li>
        <li>केवल हैदराबाद की अदालतों को अधिकार क्षेत्र प्राप्त होगा।</li>
        <li>प्राकृतिक आपदा, युद्ध आदि को वैध सेवा व्यवधान के रूप में माना जाएगा।</li>
      </ul>
      <h3 className="font-semibold">8. नियुक्ति निषेध और उत्तरदायित्व</h3>
      <ul className="list-disc ml-6 space-y-1">
        <li>ग्राहक अनुबंध समाप्ति के 12 महीनों तक हेल्थकेयर प्रोफेशनल को सीधे नियुक्त नहीं कर सकते।</li>
        <li>Curate Health किसी भी चोरी या विवाद के लिए जिम्मेदार नहीं होगा।</li>
      </ul>
      <h3 className="font-semibold">9. अंतिम घोषणा</h3>
      <p>
        चेकबॉक्स सक्षम करके, सेवा प्रदाता और ग्राहक उपरोक्त सभी शर्तों को पढ़ने, समझने और स्वेच्छा से स्वीकार करने की
        पुष्टि करते हैं।
      </p>
    </ContentWrapper>
  );

  const TeluguContent = () => (
    <ContentWrapper title="నిబంధనలు">
      <p>
        ఈ ఒప్పందం (“హెల్త్‌కేర్ ప్రొఫెషనల్ సర్వీస్ కాంట్రాక్ట్”) <strong>Curate Health Services LLP</strong> మరియు వ్యక్తిగత
        కాంట్రాక్టర్ మధ్య కుదిరింది.
      </p>
      <h3 className="font-semibold">1. నేపథ్యం</h3>
      <p>
        Curate Health అర్హత ఉన్న హెల్త్‌కేర్ నిపుణులను ఇంటి వద్ద సేవల కోసం అవసరమైన క్లయింట్లకు అనుసంధానిస్తుంది. సరైన
        గుర్తింపు మరియు అర్హత పత్రాలను సమర్పించడం కాంట్రాక్టర్ బాధ్యత.
      </p>
             <p>
            ఈ ఒప్పందం (“హెల్త్‌కేర్ ప్రొఫెషనల్ సర్వీస్ కాంట్రాక్ట్”) <strong>Curate Health Services LLP</strong> మరియు వ్యక్తిగత కాంట్రాక్టర్ మధ్య కుదిరింది.
          </p>

          <h3 className="font-semibold">1. నేపథ్యం</h3>
          <p>
            Curate Health అర్హత ఉన్న హెల్త్‌కేర్ నిపుణులను ఇంటి వద్ద సేవల కోసం అవసరమైన క్లయింట్లకు అనుసంధానిస్తుంది. సరైన గుర్తింపు మరియు అర్హత పత్రాలను సమర్పించడం కాంట్రాక్టర్ బాధ్యత.
          </p>

          <h3 className="font-semibold">2. ఒప్పంద నిబంధనలు</h3>
          <ul className="list-disc ml-6 space-y-1">
            <li>ఒప్పందం సంతకం చేసిన తేదీ నుండి అమల్లో ఉంటుంది. రెండు వారాల నోటీసుతో ముగించవచ్చు.</li>
            <li>సేవ అవసరం ఉంటే సైట్‌లో ఉండాలి, బయలుదేరే ముందు మేనేజర్లకు తెలియజేయాలి.</li>
            <li>క్లయింట్ గోప్యత రహిత సమాచారం రక్షించాలి.</li>
          </ul>

          <h3 className="font-semibold">3. చెల్లింపు నిబంధనలు</h3>
          <ul className="list-disc ml-6 space-y-1">
            <li>ప్రతి నెల ఇన్వాయిస్ ఇవ్వబడుతుంది. 7 రోజుల్లో చెల్లించాలి. ఆలస్యం అయితే ₹500/రోజు జరిమానా.</li>
            <li>ప్రతి ఏడాది 10% చెల్లింపు పెరుగుతుండవచ్చు.</li>
            <li>చెల్లింపులు బ్యాంక్ ట్రాన్స్‌ఫర్, చెక్ లేదా ప్రీపెయిడ్ నగదు కార్డ్ ద్వారా చేయవచ్చు.</li>
            <li>అనుసంధానంగా అద్దె ఫీజు లేదా పన్నులు కట్టవచ్చు.</li>
          </ul>

          <h3 className="font-semibold">4. సెలవులు మరియు ప్రత్యామ్నాయం</h3>
          <p>
            సెలవులు ముందుగానే ఆమోదించాలి. అత్యవసర సెలవులు కార్మిక చట్టాల ప్రకారం నిర్వహించబడతాయి.
          </p>

          <h3 className="font-semibold">5. గోప్యత మరియు డేటా వినియోగం</h3>
          <ul className="list-disc ml-6 space-y-1">
            <li>బ్యాక్‌గ్రౌండ్ చెక్స్‌కు అంగీకారం ఇవ్వాలి. ప్రమాణీకరణ మరియు ప్రచార పదార్థాల కోసం డేటాను ఉపయోగించవచ్చు.</li>
            <li>బయోమెట్రిక్ డేటా చట్టపరమైన భద్రత కోసం భద్రంగా నిల్వ చేయబడుతుంది.</li>
          </ul>

          <h3 className="font-semibold">6. రద్దు మరియు ఉల్లంఘన</h3>
          <ul className="list-disc ml-6 space-y-1">
            <li>5–15 రోజుల ముందుగానే లిఖితపూర్వక నోటీసుతో ముగించవచ్చు.</li>
            <li>అనుచిత ప్రవర్తన లేదా ముందుగానే తెలియజేయకుండా విడిచిపెట్టడం వలన ₹50,000 జరిమానా విధించవచ్చు.</li>
            <li>పునరావృతంగా గైర్హాజరు కావడం లేదా మత్తుపదార్థాల వాడకము వంటి ప్రవర్తన వల్ల తక్షణమే రద్దు చేయవచ్చు.</li>
          </ul>

          <h3 className="font-semibold">7. చట్టపరమైన పరిష్కారాలు</h3>
          <ul className="list-disc ml-6 space-y-1">
            <li>అన్ని వివాదాలు తెలంగాణ చట్టాల ప్రకారం పరిష్కరించబడతాయి.</li>
            <li>హైదరాబాద్ న్యాయస్థానాలకే పరిమిత న్యాయ పరిధి ఉంటుంది.</li>
            <li>ప్రाकृतिक విపత్తులు, యుద్ధం వంటివి సేవా అంతరాయానికి గల న్యాయ కారణాలుగా పరిగణించబడతాయి.</li>
          </ul>

          <h3 className="font-semibold">8. నియామక నిషేధం మరియు బాధ్యత</h3>
          <ul className="list-disc ml-6 space-y-1">
            <li>క్లయింట్లు ఒప్పందం ముగిసిన తర్వాత 12 నెలల పాటు నేరుగా నియమించరాదు.</li>
            <li>క్లయింట్ ప్రాంగణంలో జరిగే చోరీలు లేదా వివాదాలకు Curate Health బాధ్యత వహించదు.</li>
          </ul>

          <h3 className="font-semibold">9. తుది ప్రకటన</h3>
          <p>
            CheckBox‌ను ఎనేబుల్ చేయడం ద్వారా, కాంట్రాక్టర్ మరియు క్లయింట్ పై పేర్కొన్న నిబంధనలన్నింటినీ చదివామని, అర్థం చేసుకున్నామని, స్వచ్ఛందంగా అంగీకరిస్తామని ధృవీకరిస్తారు.
          </p>
    </ContentWrapper>
  );

  const renderContent = () => {
    switch (language) {
      case 'Hindi':
        return HindiContent();
      case 'Telugu':
        return TeluguContent();
      default:
        return EnglishContent();
    }
  };

  return (
    <div className="p-4 sm:p-6">
   
      {renderContent()}
    </div>
  );
};

export default TermsAndConditions;

